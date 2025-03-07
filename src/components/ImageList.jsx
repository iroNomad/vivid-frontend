import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Link } from 'react-router-dom';
import Typography from "@mui/material/Typography";
import Box from '@mui/material/Box';

export default function TitlebarBelowImageList({videos}) {
    return (
        <ImageList sx={{ width: '100%', height: 'auto', mt: 8, }} cols={3} gap={32}>
            {videos.map((item) => (
                <Link
                    to={`/video/${item.videoId}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        width: '100%',
                    }}
                >
                    <ImageListItem
                        key={item.img}
                    >
                        <img
                            src={item.thumbnailFileURL}
                            alt={item.title}
                            loading="lazy"
                            style={{
                                width: '100%',
                                aspectRatio: '16 / 9',
                                borderRadius: '10px'
                            }}
                        />
                        <ImageListItemBar
                            title={
                            <Typography variant="subtitle1" component="h3" fontSize="1.2rem">
                                {item.title}
                            </Typography>}
                            subtitle={
                                <Box>
                                    <Typography fontSize="0.8rem">{item.username}</Typography>
                                    <Typography fontSize="0.8rem">{item.uploadDate}</Typography>
                                </Box>
                            }
                            position="below"
                            sx={{
                                textAlign: 'left',
                            }}
                        />
                    </ImageListItem>
                </Link>
            ))}
        </ImageList>
    );
}