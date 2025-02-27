import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { Link } from 'react-router-dom';

export default function TitlebarBelowImageList({videos}) {
    return (
        <ImageList sx={{ width: '100%', height: 'auto' }} cols={4} gap={12}>
            {videos.map((item) => (
                <Link
                    to={`/video/${item.id}`}
                    style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'block',
                        width: '100%',
                    }}
                >
                    <ImageListItem key={item.img}>
                        <img
                            src={item.thumbnailFileURL}
                            alt={item.title}
                            loading="lazy"
                        />
                        <ImageListItemBar
                            title={item.title}
                            subtitle={
                                <>
                                    {item.userId} <br />
                                    {item.uploadDateTime}
                                </>
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