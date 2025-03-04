import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function VideoPage() {
    const { videoId } = useParams(); // Get videoId from URL
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await fetch(`http://localhost:8080/video/${videoId}`);
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
        <div>
            <video
                width="60%"
                height="auto"
                controls
                // poster={video.thumbnailFileURL}
                autoPlay={true}
            >
                <source src={video.videoFileURL} type="video/mp4" /> {/* ✅ Uses correct API response field */}
                Your browser does not support the video tag.
            </video>
            <h2>{video.title}</h2>
            <h4>{video.username}</h4>
            <p>{video.description}</p>
            <p>{video.uploadDate}</p>
        </div>
    );
}
