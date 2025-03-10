import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import {Button, TextField} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {useState} from "react";
import { BASE_URL } from '../config';
import {ImageListItem, ImageList} from "@mui/material";
import { ImageUrls } from '../assets/profileImg.js';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

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

export default function PrimarySearchAppBar({loginState, onSearch}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [loginUserName, setLoginUserName] = React.useState('');
    const [loginPassword, setLoginPassword] = React.useState('');
    const [regUserName, setRegUserName] = React.useState('');
    const [regPassword, setRegPassword] = React.useState('');
    const [regPasswordConfirm, setRegPasswordConfirm] = React.useState('');
    const [proImg, setProImg] = React.useState(0);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const [loginModalOpen, setLoginModalOpen] = React.useState(false);
    const [regModalopen, setRegModalOpen] = React.useState(false);
    const [proImgModalOpen, setProImgModalOpen] = React.useState(false);

    const openLoginModal = () => setLoginModalOpen(true);
    const closeLoginModal = () => setLoginModalOpen(false);

    const openRegModal = () => setRegModalOpen(true);
    const closeRegModal = () => setRegModalOpen(false);

    const openProImgModal = () => setProImgModalOpen(true);
    const closeProImgModal = () => setProImgModalOpen(false);

    const validateAndHandleRegister = (event) => {
        event.preventDefault();

        // Username Validation
        if (regUserName.length < 4 || regUserName.length > 20) {
            alert("사용자 이름은 4자 이상 20자 이하여야 합니다.");
            return;
        }

        if (!/^[a-zA-Z0-9_]+$/.test(regUserName)) {
            alert("사용자 이름은 영문자, 숫자, 밑줄(_)만 사용할 수 있습니다.");
            return;
        }

        // Password Validation
        if (!/^[a-zA-Z0-9!@#$%]+$/.test(regPassword)) {
            alert("비밀번호는 영문자, 숫자, 그리고 !@#$% 기호만 사용할 수 있습니다.");
            return;
        }

        if (regPassword.length < 6 || regPassword.length > 20) {
            alert("비밀번호는 6자 이상 20자 이하여야 합니다.");
            return;
        }

        if (regPassword !== regPasswordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // Proceed with registration logic
        handleRegister(event);
    };

    const handleRegister = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(BASE_URL + "/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: regUserName,
                    password: regPassword,
                    avatarCode: proImg,
                }),
            });

            if (!response.ok) {
                if (response.status === 400) {
                    alert("이미 사용중인 사용자 이름입니다.");
                    return;
                }
                throw new Error("회원가입 실패! 다시 시도해주세요.");
            }

            alert("회원가입 성공!");
            closeRegModal();
            openLoginModal();
            setLoginUserName(regUserName);
        } catch (error) {
            setError && setError(error.message);
        }
    };

    const handleLogin = async (event) => {
        event.preventDefault(); // Prevents page reload

        try {
            const response = await fetch(BASE_URL + "/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: loginUserName, // Match the backend field names
                    password: loginPassword,
                }),
            });

            if (response.status === 401) {
                alert("이름 또는 비밀번호가 잘못되었습니다."); // Show error in UI
                return;
            }

            if (!response.ok) {
                throw new Error("로그인 실패! 이름 또는 비밀번호를 확인하세요.");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token); // Store JWT token

            alert("로그인 성공!");
            closeLoginModal();

            window.location.reload();
        } catch (error) {
            setError(error.message);
        }
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const navigate = useNavigate();

    const handleMenuClose = (path) => {
        setAnchorEl(null); // Close the menu
        handleMobileMenuClose();

        if (path) {
            navigate(path);  // Navigate to the given path
        }
    };

    const logout = () => {
        localStorage.removeItem("token"); // Remove token
        window.location.href = "/"; // Redirect to main page
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        navigate("/");
        onSearch(searchQuery);
    };

    const clearSearchInput = () => {
        setSearchQuery("");
        onSearch("");
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => handleMenuClose("/mypage")}>마이 페이지</MenuItem>
            <MenuItem onClick={() => logout()}>로그아웃</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
                <p>Profile</p>
            </MenuItem>
        </Menu>
    );

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="fixed" sx={{ width: '100%' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                            onClick={() => { navigate("/"); window.location.reload(); }}
                        >
                            <HomeIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            Vivid
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Search sx={{ minWidth: '40%', display: 'flex', alignItems: 'center' }}>
                            <SearchIconWrapper>
                                <SearchIcon />
                            </SearchIconWrapper>
                            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                <StyledInputBase sx={{ width: '100%' }}
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                />
                                <IconButton aria-label="delete" onClick={clearSearchInput} sx={{ color: 'white' }}>
                                    <CloseIcon />
                                </IconButton>
                            </form>
                        </Search>
                        <Box sx={{ flexGrow: 1 }} />
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <IconButton
                                size="large"
                                edge="end"
                                aria-label="account of current user"
                                aria-controls={menuId}
                                aria-haspopup="true"
                                onClick={(loginState == true) ? handleProfileMenuOpen : openLoginModal}
                                color="inherit"
                            >
                                <AccountCircle />
                                <Typography variant="button" sx={{ display: 'block' }}>
                                    {(loginState == true) ? "프로필" : "로그인"}
                                </Typography>
                            </IconButton>
                        </Box>
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>
                {renderMobileMenu}
                {renderMenu}
            </Box>
            <Modal
                open={loginModalOpen}
                onClose={closeLoginModal}
                aria-labelledby="loginModal"
            >
                <Box sx={style}>
                    <Typography id="loginModal" variant="h6" component="h2" align='center' fontWeight="bold">
                        회원 로그인
                    </Typography>
                    <br/>
                    <TextField
                        id="outlined-basic"
                        label="사용자 이름"
                        variant="outlined"
                        fullWidth
                        required
                        value={loginUserName}
                        onChange={(event) => setLoginUserName(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <TextField
                        type="password"
                        id="outlined-basic"
                        label="비밀번호"
                        variant="outlined"
                        fullWidth
                        required
                        value={loginPassword}
                        onChange={(event) => setLoginPassword(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <Typography
                        align="center"
                    >
                        회원 아니신가요? <Button onClick={() => {
                        closeLoginModal();
                        openRegModal();
                    }}>회원가입하기</Button>
                    </Typography>
                    <br/>
                    <Button style={{display: "block", margin: 'auto'}} variant="contained" onClick={handleLogin}>로그인</Button>
                </Box>
            </Modal>

            <Modal
                open={regModalopen}
                onClose={closeRegModal}
                aria-labelledby="loginModal"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2" align="center" fontWeight="bold">
                        회원 가입
                    </Typography>
                    <br/>
                    <img
                        style={{maxWidth: 130, aspectRatio: '1/1', objectFit: "cover", borderRadius: '50%', display: 'block', margin: 'auto', cursor: 'pointer'}}
                        src={ImageUrls[proImg]}
                        onClick={() => openProImgModal()}
                        onMouseEnter={(e) => { e.target.style.outline = '3px solid black' }}
                        onMouseLeave={(e) => { e.target.style.outline = 'none' }}
                    />
                    <br/>
                    <TextField
                        id="outlined-basic"
                        label="새 사용자 이름"
                        variant="outlined"
                        fullWidth
                        required
                        value={regUserName}
                        onChange={(event) => setRegUserName(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <TextField
                        type="password"
                        id="outlined-basic"
                        label="새 비밀번호"
                        variant="outlined"
                        fullWidth
                        required
                        value={regPassword}
                        onChange={(event) => setRegPassword(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <TextField
                        id="outlined-basic"
                        label="비밀번호 확인"
                        variant="outlined"
                        fullWidth
                        required
                        value={regPasswordConfirm}
                        onChange={(event) => setRegPasswordConfirm(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <Typography
                        align="center"
                    >
                        이미 가입하셨나요? <Button onClick={() => {
                        closeRegModal();
                        openLoginModal();
                    }}>로그인하기</Button>
                    </Typography>
                    <br/>
                    <Button
                        style={{display: 'block', margin: 'auto'}}
                        variant="contained"
                        onClick={validateAndHandleRegister}>가입하기</Button>
                </Box>
            </Modal>

            <Modal
                open={proImgModalOpen}
                onClose={closeProImgModal}
                aria-labelledby="profileImageModal"
            >
                <ImageList sx={{ position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    p: 1,
                    color: 'black',}} cols={3} gap={8}>
                    {(ImageUrls).map((item, index) => (
                        <ImageListItem key={index}>
                            <img
                                style={{ cursor: 'pointer' }}
                                srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                src={`${item}?w=164&h=164&fit=crop&auto=format`}
                                alt={`Avatar ${index + 1}`}
                                onMouseEnter={(e) => { e.target.style.outline = '3px solid black'; }}
                                onMouseLeave={(e) => { e.target.style.outline = 'none'; }}
                                onClick={() => {
                                    setProImg(index); // Use index directly
                                    closeProImgModal();
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
            </Modal>
        </>
    );
}