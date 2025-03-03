import React, { useEffect, useState } from "react";
import {Button, Modal, Box, Typography, TextField, Input} from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useNavigate, useNavigation} from "react-router-dom";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    color: 'black',
};

export default function MyPage() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            alert("로그인 후 마이페이지 접속 가능합니다.");
            navigate("/"); // Redirect to home
        }
    }, [navigate]);

    // Handle file selection
    const handleFileChange = (event) => {
        const file = event.target.files[0]; // Get the first selected file
        if (file) {
            setSelectedFile(file);
        }
    };

    // Fetch user info using token
    useEffect(() => {
        if (token) {
            fetch("http://localhost:8080/mypage", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`, // Send token in headers
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch user data");
                    }
                    return response.json();
                })
                .then(data => setUserData(data))
                .catch(error => console.error("Error fetching user data:", error));
        }
    }, [token]);

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("영상 파일을 선택하십시오!");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", selectedFile);

        try {
            const response = await fetch("http://localhost:8080/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                // const data = await response.json();
                alert("영상 업로드 완료!");
                handleClose(); // Close the modal after upload
            } else {
                alert("영상 업로드 실패.");
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            alert("업로드 오류!");
        }
    };

    return (
        <div>
            <Button onClick={handleOpen}>Upload Video</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Upload Video
                    </Typography>
                    <br/>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        Select video file
                        <Input
                            type="file"
                            onChange={handleFileChange}
                            multiple
                        />
                    </Button>
                    <br/>
                    <br/>
                    <TextField
                        id="outlined-basic"
                        label="Title"
                        variant="outlined"
                        fullWidth
                        required
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="Description"
                        multiline
                        maxRows={4}
                        fullWidth
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <Button variant="contained" onClick={handleUpload}>Done</Button>
                </Box>
            </Modal>
            <h1>My Page</h1>
            {userData ? (
                <div>
                    <p>Username: {userData.username}</p>
                    <p>Joined: {new Date(userData.registrationDate).toLocaleDateString()}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}
