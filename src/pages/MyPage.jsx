import React, { useEffect, useState } from "react";
import {Paper, Stack, Button, Modal, Box, Typography, TextField, Input, Container} from "@mui/material";
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {useNavigate} from "react-router-dom";
import { BASE_URL } from '../config.js';
import withWidth from "@mui/material/Hidden/withWidth.js";

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
    const [isUploading, setIsUploading] = useState(false);
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
            const validFormats = ['video/mp4', 'video/webm'];
            if (!validFormats.includes(file.type)) {
                alert("잘못된 파일 형식입니다. MP4 또는 WebM 비디오 파일을 선택하십시오.");
                setSelectedFile(null); // Clear the selected file state
                event.target.value = null;
                return;
            }
            setSelectedFile(file);
        }
    };

    // Fetch user info using token
    useEffect(() => {
        if (token) {
            fetch(BASE_URL + "/mypage", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}` // Send token in headers
                }
            })
                .then(response => {
                    if (response.status === 401) {
                        alert("토큰이 유효하지 않습니다. 다시 로그인해 주십시오.");
                        logout(); // Call logout function on 401 error
                    }
                    if (!response.ok) {
                        throw new Error("사용자 데이터를 가져오지 못했습니다.");
                    }
                    return response.json();
                })
                .then(data => setUserData(data))
                .catch(error => console.error("사용자 데이터 가져오기 오류:", error));
        }
    }, [token]);

    // Handle file upload
    const handleUpload = async () => {
        if (!selectedFile) {
            alert("영상 파일을 선택하십시오!");
            return;
        }

        setIsUploading(true); // Set uploading state to true

        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("video", selectedFile);

        try {
            const response = await fetch(BASE_URL + "/video/upload", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("영상 업로드 완료!");
                handleClose(); // Close the modal after upload
            } else {
                alert("영상 업로드 실패");
            }
        } catch (error) {
            console.error("영상 업로드 오류:", error);
            alert("업로드 오류! 네트워크 문제일 수 있습니다.");
        } finally {
            setIsUploading(false); // Reset uploading state
        }
    };

    const logout = () => {
        localStorage.removeItem("token"); // Remove token
        window.location.href = "/"; // Redirect to main page
    };

    return (
        <Container sx={{
            mt: 10,
            mb: 40,
            width: "100vh",
            height: "100vh",
        }}>
            <Stack
                direction="column"
                spacing={2}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "stretch",
                }}
            >
                <Box sx={{
                    bgcolor: 'grey',
                }}>
                    {userData ? (
                        <Box sx={{textAlign: 'left', p: 2}}>
                            <Typography>{userData.username}</Typography>
                            <Typography>가입일: {new Date(userData.registrationDate).toLocaleDateString()}</Typography>
                        </Box>
                    ) : (
                        <Typography>사용자 데이터 로딩 중...</Typography>
                    )}
                    <Button onClick={handleOpen}>비디오 업로드</Button>
                </Box>
                {userData && userData.videos.map((video) => (
                    <Box key={video.videoId} sx={{ border: 1, borderColor: 'grey', borderStyle: 'solid', display: 'flex', alignItems: 'center' }}>
                        <img src={video.thumbnailFileURL} alt={video.title} style={{ width: '40%', height: 'auto', marginRight: '16px' }} />
                        <Box sx={{textAlign: 'left'}}>
                            <Typography variant="h6">{video.title}</Typography>
                            <br/>
                            <Typography variant="body2">{video.description}</Typography>
                            <Typography variant="caption">{video.uploadDate}</Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        비디오 업로드
                    </Typography>
                    <br/>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                    >
                        비디오 파일 선택
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
                        label="제목"
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
                        label="설명"
                        multiline
                        maxRows={4}
                        fullWidth
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <Button variant="contained" onClick={handleUpload} disabled={isUploading}>
                        {isUploading ? "업로드 중..." : "완료"}
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}