import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CommentSection from '../components/CommentSection';
import { BASE_URL } from "../config.js";

export default function VideoPage() {
    const { videoId } = useParams(); // Get videoId from URL
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(BASE_URL + `/video/${videoId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch video (Status: ${response.status})`);
                }
                const data = await response.json();
                setVideo(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [videoId]); // Fetch data when videoId changes

    if (loading) return <p>Loading video...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!video) return <p>Video not found.</p>;

    return (
        <Box sx={{
            position: 'absolute',
            top: '5rem',
            transform: 'translate(-50%)',
        }}>
            <video
                width="100%"
                height="auto"
                controls
                poster={video.thumbnailFileURL}
                autoPlay={true}
            >
                <source src={video.videoFileURL} type="video/mp4" /> {/* ✅ Uses correct API response field */}
                Your browser does not support the video tag.
            </video>
            <Box sx={{
                mt: 2,
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'left',
                gap: 2,
            }}>
                <Typography variant="h4">{video.title}</Typography>
                <Typography variant="subtitle1">{video.username} • {video.uploadDate}</Typography>
                <Typography variant="body1">{video.description}</Typography>
            </Box>
        </Box>
    );
}
