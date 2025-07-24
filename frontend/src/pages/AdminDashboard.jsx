import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Container, Typography, Grid, Card, CardContent, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress, Alert } from '@mui/material';
import { Delete as DeleteIcon, People as PeopleIcon, PostAdd as PostAddIcon } from '@mui/icons-material';

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchData = async () => {
        setLoading(true);
        setError('');
        try {
            const [analyticsRes, usersRes] = await Promise.all([
                API.get('/admin/analytics'),
                API.get('/admin/users')
            ]);
            setAnalytics(analyticsRes.data);
            setUsers(usersRes.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch admin data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user and all their content?')) {
            try {
                await API.delete(`/admin/users/${userId}`);
                fetchData(); // Refetch data to update the list
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={4}>
                    <Card><CardContent>
                        <PeopleIcon color="primary" sx={{ fontSize: 40, float: 'right' }} />
                        <Typography color="text.secondary" gutterBottom>Total Users</Typography>
                        <Typography variant="h4">{analytics?.totalUsers}</Typography>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Card><CardContent>
                        <PostAddIcon color="secondary" sx={{ fontSize: 40, float: 'right' }} />
                        <Typography color="text.secondary" gutterBottom>Total Posts</Typography>
                        <Typography variant="h4">{analytics?.totalPosts}</Typography>
                    </CardContent></Card>
                </Grid>
            </Grid>
            
            <Typography variant="h5" gutterBottom>User Management</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead><TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Joined</TableCell>
                        <TableCell align="right">Actions</TableCell>
                    </TableRow></TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleDeleteUser(user._id)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default AdminDashboard;