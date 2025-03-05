import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

export default function CommentSection({ videoId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await fetch(`http://localhost:8080/video/${videoId}/comments`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch comments (Status: ${response.status})`);
                }
                const data = await response.json();
                setComments(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [videoId]);

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/video/${videoId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: newComment }),
            });
            if (!response.ok) {
                throw new Error(`Failed to post comment (Status: ${response.status})`);
            }
            const data = await response.json();
            setComments([...comments, data]);
            setNewComment('');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">{error}</Typography>;

    return (
        <Box>
            <Typography variant="h6">Comments</Typography>
            <List>
                {comments.map((comment) => (
                    <ListItem key={comment.id}>
                        <ListItemText primary={comment.text} />
                    </ListItem>
                ))}
            </List>
            <form onSubmit={handleCommentSubmit}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Add a comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Submit
                </Button>
            </form>
        </Box>
    );
}