import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress, Alert, Link } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const AdminCommentPage = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchComments = async () => {
        try {
            const { data } = await API.get('/admin/comments');
            setComments(data);
        } catch (err) {
            setError('Failed to fetch comments.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await API.delete(`/admin/comments/${commentId}`);
                fetchComments(); // Refetch comments
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete comment.');
            }
        }
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Manage Comments</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead><TableRow>
                        <TableCell sx={{width: '40%'}}>Comment</TableCell>
                        <TableCell>Author</TableCell>
                        <TableCell>In Post</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                        {comments.map((comment) => (
                            <TableRow key={comment._id}>
                                <TableCell>{comment.content}</TableCell>
                                <TableCell>{comment.user?.name || 'N/A'}</TableCell>
                                <TableCell>
                                    <Link component={RouterLink} to={`/post/${comment.post?._id}`}>
                                        {comment.post?.title || 'N/A'}
                                    </Link>
                                </TableCell>
                                <TableCell>{new Date(comment.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleDeleteComment(comment._id)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default AdminCommentPage;