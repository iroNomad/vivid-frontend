import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export default function TitlebarImageList({videos}) {
    return (
        <ImageList sx={{ width: '100%', height: 'auto' }} cols={4} gap={12}>
            {videos.map((item) => (
                <ImageListItem key={item.img}>
                    <img
                        src="https://images.unsplash.com/photo-1501952476817-d7ae22e8ee4e?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                        sx={{
                            textAlign: 'left',
                        }}
                    />
                </ImageListItem>
            ))}
        </ImageList>
    );
}