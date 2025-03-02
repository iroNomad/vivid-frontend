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
import {useState} from "react";

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

export default function PrimarySearchAppBar({loginState}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
    const [userName, setUserName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [regUserName, setRegUserName] = React.useState('');
    const [regPassword, setRegPassword] = React.useState('');
    const [regPasswordConfirm, setRegPasswordConfirm] = React.useState('');
    const [error, setError] = useState("");

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const [open, setOpen] = React.useState(false);
    const [regModalopen, setRegModalOpen] = React.useState(false);

    const openLoginModal = () => setOpen(true);
    const closeLoginModal = () => setOpen(false);

    const openRegModal = () => setRegModalOpen(true);
    const closeRegModal = () => setRegModalOpen(false);

    const handleRegister = () => {
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

        if (regPassword.length < 8 || regPassword.length > 20) {
            alert("비밀번호는 8자 이상 20자 이하여야 합니다.");
            return;
        }

        if (regPassword !== regPasswordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        // Proceed with registration logic
        alert("회원가입 성공!");
    };


    const handleLogin = async (event) => {
        event.preventDefault(); // Prevents page reload

        try {
            const response = await fetch("http://localhost:8080/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: userName, // Match the backend field names
                    password: password,
                }),
            });

            if (response.status === 401) {
                alert("아이디 또는 비밀번호가 잘못되었습니다."); // Show error in UI
                return;
            }

            if (!response.ok) {
                throw new Error("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
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
            <MenuItem onClick={() => handleMenuClose("/mypage")}>My Page</MenuItem>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
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
                        onClick={() => navigate("/")}
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
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
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
                                {(loginState == true) ? "마이 페이지" : "로그인"}
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
                open={open}
                onClose={closeLoginModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        회원 로그인
                    </Typography>
                    <br/>
                    <TextField
                        id="outlined-basic"
                        label="사용자 아이디"
                        variant="outlined"
                        fullWidth
                        required
                        value={userName}
                        onChange={(event) => setUserName(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <TextField
                        id="outlined-basic"
                        label="비밀번호"
                        variant="outlined"
                        fullWidth
                        required
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <Typography
                    >
                        화원 아니신가요? <Button onClick={() => {
                            closeLoginModal();
                            openRegModal();
                        }}>회원가입하기</Button>
                    </Typography>
                    <br/>
                    <Button variant="contained" onClick={handleLogin}>로그인</Button>
                </Box>
            </Modal>

            <Modal
                open={regModalopen}
                onClose={closeRegModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        회원가입
                    </Typography>
                    <br/>
                    <TextField
                        id="outlined-basic"
                        label="새 사용자 아이디"
                        variant="outlined"
                        fullWidth
                        required
                        value={regUserName}
                        onChange={(event) => setRegUserName(event.target.value)}
                    />
                    <br/>
                    <br/>
                    <TextField
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
                    >
                        이미 가입하셨나요? <Button onClick={() => {
                        closeRegModal();
                        openLoginModal();
                    }}>로그인하기</Button>
                    </Typography>
                    <br/>
                    <Button variant="contained" onClick={handleRegister}>가입하기</Button>
                </Box>
            </Modal>
        </>
    );
}
