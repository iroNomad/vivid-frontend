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
                        sx={{
                            position: 'relative',
                            '&:hover .overlay': {
                                opacity: 1
                            }
                        }}
                    >
                        <Box position="relative">
                            <img
                                src={item.thumbnailFileURL}
                                alt={item.title}
                                loading="lazy"
                                style={{
                                    width: '100%',
                                    aspectRatio: '16 / 9',
                                    borderRadius: '10px',
                                    display: 'block'
                                }}
                            />
                            <Box
                                className="overlay"
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity',
                                    borderRadius: '10px',
                                    cursor: 'pointer'
                                }}
                            >
                                <PlayArrowIcon sx={{ color: 'white', fontSize: 48 }} />
                            </Box>
                        </Box>
                        <ImageListItemBar
                            title={
                                <Typography variant="subtitle1" component="h3" fontSize="1.2rem">
                                    {item.title}
                                </Typography>}
                            subtitle={
                                <Box>
                                    <Typography>{item.username} • {formatUploadDate(item.uploadDate)}</Typography>
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