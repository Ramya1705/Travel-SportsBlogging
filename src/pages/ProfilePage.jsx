import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/AuthContext';
// Add 'Paper' to this import line
import { Container, Typography, Box, Avatar, CircularProgress, Alert, Button, Grid, Tabs, Tab, Paper } from '@mui/material';

const ProfilePage = () => {
    const { userId } = useParams();
    const { user: loggedInUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [tabIndex, setTabIndex] = useState(0); // State for tabs

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data } = await API.get(`/users/${userId}`);
                setProfile(data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleLike = () => {}; // Placeholder for cards

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;
    if (error) return <Container><Alert severity="error">{error}</Alert></Container>;
    if (!profile) return null;

    const publishedPosts = profile.posts.filter(p => p.status === 'published');
    const draftPosts = profile.posts.filter(p => p.status === 'draft');
    const isOwner = loggedInUser?._id === userId;

    return (
        <Container maxWidth="lg">
            <Paper sx={{ p: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2 }}>
                <Avatar src={profile.user.profilePicture} sx={{ width: 120, height: 120, mb: 2, border: '4px solid white', boxShadow: 3 }} />
                <Typography variant="h4">{profile.user.name}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    {profile.user.bio || 'This user has not set a bio yet.'}
                </Typography>
                {isOwner && (
                    <Button component={Link} to="/profile/edit" variant="contained" sx={{ mt: 2 }}>Edit Profile</Button>
                )}
            </Paper>

            {/* Tabs are only shown if the logged-in user is the owner of the profile */}
            {isOwner ? (
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={tabIndex} onChange={(e, newValue) => setTabIndex(newValue)} centered>
                        <Tab label={`Published (${publishedPosts.length})`} />
                        <Tab label={`Drafts (${draftPosts.length})`} />
                    </Tabs>
                </Box>
            ) : (
                <Typography variant="h5" gutterBottom>Posts by {profile.user.name}</Typography>
            )}

            {/* Published Posts */}
            <Box hidden={tabIndex !== 0}>
                <Grid container spacing={4}>
                    {publishedPosts.length > 0 ? (
                        publishedPosts.map(post => (
                            <Grid item key={post._id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                                <PostCard post={post} onLike={handleLike} isLiked={false} />
                            </Grid>
                        ))
                    ) : (
                        <Container><Typography sx={{ textAlign: 'center', mt: 4 }}>No published posts yet.</Typography></Container>
                    )}
                </Grid>
            </Box>

            {/* Drafts (only rendered for the owner) */}
            <Box hidden={tabIndex !== 1}>
                {isOwner && (
                    <Grid container spacing={4}>
                        {draftPosts.length > 0 ? (
                            draftPosts.map(post => (
                                <Grid item key={post._id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                                    <PostCard post={post} onLike={handleLike} isLiked={false} />
                                </Grid>
                            ))
                        ) : (
                            <Container><Typography sx={{ textAlign: 'center', mt: 4 }}>You have no saved drafts.</Typography></Container>
                        )}
                    </Grid>
                )}
            </Box>
        </Container>
    );
};

export default ProfilePage;