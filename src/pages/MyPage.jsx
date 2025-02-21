// import React from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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

function MyPage() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const[title, setTitle] = React.useState('');
    const[description, setDescription] = React.useState('');
    const handleUpload = event => {
        event.preventDefault();
        const video = {title, description}
        console.log('video - ', video);

        fetch("http://localhost:8080/upload", {
            method: 'POST',
            headers: {"content-type": "application/json"},
            body: JSON.stringify(video),
            }
        ).then(()=>{
            console.log('video uploaded');
        })
    }

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
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => console.log(event.target.files)}
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
            <p>This is the my page of my Vite React app.</p>
        </div>
    );
}

export default MyPage;
