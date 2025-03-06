import React, { useEffect, useState } from "react";
import {Stack, Button, Modal, Box, Typography, TextField, Input, Container, Menu, MenuItem} from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import {useNavigate} from "react-router-dom";
import { BASE_URL } from '../config.js';

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
    const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
    const openUploadModal = () => setUploadModalOpen(true);
    const closeUploadModal = () => setUploadModalOpen(false);
    const [videoEditModalOpen, setVideoEditModalOpen] = React.useState(false);
    const [videoForEditing, setVideoForEditing] = useState({
        id: 0,
        title: '',
        description: '',
        img: ''
    });
    const [selectedVideo, setSelectedVideo] = useState(null);
    const handleMenuClick = (event, video) => {
        setAnchorEl(event.currentTarget);
        setSelectedVideo(video);
    };

    const openVideoEditModal = (video) => {
        setVideoEditModalOpen(true);
        setVideoForEditing({
            videoId: video.videoId,
            title: video.title,
            description: video.description,
            img: video.thumbnailFileURL
        });
    };

    const closeVideoEditModal = () => setVideoEditModalOpen(false);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const token = localStorage.getItem("token");

    const [anchorEl, setAnchorEl] = React.useState(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

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
                alert("잘못된 파일 형식입니다. MP4 또는 WebM 영상 파일을 선택하십시오.");
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
                closeUploadModal(); // Close the modal after upload
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

    const handleVideoEdit = async (video) => {

        setIsEditing(true);
        try {
            const response = await fetch(`${BASE_URL}/video/update/${video.videoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: video.title,
                    description: video.description
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update video');
            }

            alert('영상이 수정되었습니다.');
            closeVideoEditModal();
            window.location.reload();
        } catch (error) {
            console.error('Error updating video:', error);
            alert('영상 수정에 실패했습니다.');
        } finally {
            setIsEditing(false);
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
                <Box>
                    {userData ? (
                        <Box sx={{textAlign: 'left', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <img src="https://images.unsplash.com/photo-1554692936-82776f9406db?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                style={{height: 'auto', width: '30%', aspectRatio: '1/1', objectFit: 'cover', borderRadius: '50%'}}
                            />
                            <Box sx={{ maxWidth: '60%', m: 5 }}>
                                <Typography>{userData.username}</Typography>
                                <Typography>가입일: {new Date(userData.registrationDate).toLocaleDateString()}</Typography>
                                <br/>

                                <br/>
                                <br/>
                                <Button variant="outlined" startIcon={<PersonOffIcon />}>회원 탈퇴</Button>
                            </Box>
                        </Box>
                    ) : (
                        <Typography>사용자 데이터 로딩 중...</Typography>
                    )}
                </Box>
                <Button
                    sx={{
                        height: '10vh',
                        fontSize: '1.5rem',
                        '& .MuiSvgIcon-root': {
                            fontSize: '2.5rem'
                        }
                    }}
                    size="large"
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={openUploadModal}>
                    영상 업로드
                </Button>
                {userData && userData.videos.map((video) => (
                    <Box key={video.videoId} sx={{ border: 1, borderColor: 'grey', borderStyle: 'solid', display: 'flex', alignItems: 'center' }}>
                        <img src={video.thumbnailFileURL} alt={video.title} style={{ width: '40%', height: 'auto'}} />
                        <Box sx={{textAlign: 'left', width: '40%', p: 2}}>
                            <Typography variant="h6">{video.title}</Typography>
                            <br/>
                            <Typography variant="body2">{video.description}</Typography>
                            <Typography variant="caption">{video.uploadDate}</Typography>
                        </Box>
                        <Button
                            sx={{mt: 1, mr: 1, mb: 'auto', ml: 'auto'}}
                            aria-label="edit"
                            color="inherit"
                            id="basic-button"
                            aria-controls={menuOpen ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={menuOpen ? 'true' : undefined}
                            onClick={(event) => handleMenuClick(event, video)}>
                            <MoreHorizIcon/>
                        </Button>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={menuOpen}
                            onClose={handleMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem onClick={() => { handleMenuClose(); openVideoEditModal(selectedVideo); }}>수정</MenuItem>
                            <MenuItem onClick={handleMenuClose}>삭제</MenuItem>
                        </Menu>
                    </Box>
                ))}
            </Stack>
            <Modal
                open={uploadModalOpen}
                onClose={closeUploadModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        영상 업로드
                    </Typography>
                    <br/>
                    <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        // startIcon={<CloudUploadIcon />}
                    >
                        <Box display="flex" flexDirection="column">
                            <Typography>파일 선택</Typography>
                            <Input type="file" onChange={handleFileChange} multiple={false} />
                        </Box>
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
            <Modal
                open={videoEditModalOpen}
                onClose={closeVideoEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        정보 수정
                    </Typography>
                    <br/>
                    <img src={videoForEditing.img} width={"100%"} alt={videoForEditing.title} />
                    <br/>
                    <br/>
                    <TextField
                        id="outlined-basic"
                        label="제목"
                        variant="outlined"
                        fullWidth
                        required
                        value={videoForEditing.title}
                        onChange={(event) => setVideoForEditing({
                            ...videoForEditing,
                            title: event.target.value
                        })}
                    />
                    <br/>
                    <br/>
                    <TextField
                        id="outlined-multiline-flexible"
                        label="설명"
                        multiline
                        maxRows={4}
                        fullWidth
                        value={videoForEditing.description}
                        onChange={(event) => setVideoForEditing({
                            ...videoForEditing,
                            description: event.target.value
                        })}
                    />
                    <br/>
                    <br/>
                    <Button variant="contained" onClick={() => handleVideoEdit(videoForEditing)} disabled={isUploading}>
                        {isEditing ? "수정 중..." : "수정하기"}
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
}