import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress, Alert, Button } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';

const AdminPostPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            const { data } = await API.get('/posts');
            setPosts(data);
        } catch (err) {
            setError('Failed to fetch posts.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // The adminDeletePost in the admin controller doesn't exist, so we use the regular post delete route
    // The permission check we added will allow the admin to delete it.
    const handleDeletePost = async (postId) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await API.delete(`/posts/${postId}`);
                fetchPosts(); // Refetch posts
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete post.');
            }
        }
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Manage Posts</Typography>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />} 
                    component={RouterLink} 
                    to="/create-post"
                >
                    Create New Post
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Paper sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05)', borderRadius: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {posts.map((post) => (
                                <TableRow key={post._id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>{post.title}</TableCell>
                                    <TableCell>{post.user.name}</TableCell>
                                    <TableCell>
                                        <Typography 
                                            variant="body2"
                                            sx={{ 
                                                bgcolor: post.status === 'published' ? 'success.light' : 'warning.light',
                                                color: 'white',
                                                borderRadius: '12px',
                                                px: 1.5,
                                                py: 0.5,
                                                display: 'inline-block',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {post.status}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell align="right">
                                        <IconButton component={RouterLink} to={`/edit-post/${post._id}`} color="primary"><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDeletePost(post._id)} color="error"><DeleteIcon /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
};

export default AdminPostPage;