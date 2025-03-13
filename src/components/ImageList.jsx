import React from 'react';
import { ImageList, ImageListItem, ImageListItemBar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function TitlebarBelowImageList({videos}) {
    return (
        <ImageList sx={{
            width: '80%',
            top: '5rem',
            position: 'absolute',
            transform: 'translateX(-50%)',
        }}
                   cols={3} gap={32}>
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