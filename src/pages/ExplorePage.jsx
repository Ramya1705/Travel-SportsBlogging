import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import PostCard from '../components/PostCard';
import { useDebounce } from '../hooks/useDebounce';
import { AuthContext } from '../context/AuthContext';
import { Container, Typography, TextField, Box, CircularProgress, Alert, Chip, Grid, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// Icons for the search bar and tags
import SearchIcon from '@mui/icons-material/Search';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const ExplorePage = () => {
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Fetch tags and posts
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const { data } = await API.get('/posts/tags');
                setTags(data);
            } catch (err) { console.error('Failed to fetch tags', err); }
        };
        fetchTags();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
                if (selectedTag) params.append('tag', selectedTag);
                
                const { data } = await API.get(`/posts?${params.toString()}`);
                setPosts(data);
            } catch (err) {
                setError('Failed to fetch posts.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [debouncedSearchTerm, selectedTag]);

    // Function to handle liking a post
    const handleLike = async (postId) => {
        if (!user) return navigate('/login');
        const originalPost = posts.find(p => p._id === postId);
        if (!originalPost) return;

        const isCurrentlyLiked = originalPost.likes.includes(user._id);
        const newLikes = isCurrentlyLiked
            ? originalPost.likes.filter(id => id !== user._id)
            : [...originalPost.likes, user._id];
        
        const updatedPosts = posts.map(p => 
            p._id === postId ? { ...p, likes: newLikes } : p
        );
        setPosts(updatedPosts);

        try {
            await API.put(`/posts/${postId}/like`);
        } catch (err) {
            setPosts(posts); // Revert on error
            console.error('Failed to update like status', err);
        }
    };

    const handleTagClick = (tag) => setSelectedTag(prev => (prev === tag ? null : tag));
    
    // Helper to get an icon for specific tags
    const getTagIcon = (tag) => {
        const lowerCaseTag = tag.toLowerCase();
        if (lowerCaseTag.includes('travel')) return <FlightTakeoffIcon />;
        if (lowerCaseTag.includes('sports')) return <SportsSoccerIcon />;
        return null;
    };

    return (
        <Container maxWidth="xl" sx={{ p: '0 !important' }}>
            {/* --- Hero Section --- */}
            <Box sx={{
                position: 'relative',
                height: '40vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: 'white',
                textAlign: 'center',
                p: 3,
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    backgroundImage: 'linear-gradient(to top, rgba(0, 50, 120, 0.7), rgba(0, 123, 255, 0.5))',
                    zIndex: 1,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0,
                    width: '100%', height: '100%',
                    backgroundImage: 'url(https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?q=80&w=2070)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                }
            }}>
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                    <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Discover Stories
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 3, color: 'rgba(255,255,255,0.9)' }}>
                        Find your next adventure in sports and travel
                    </Typography>
                    <TextField
                        fullWidth
                        placeholder="Search for posts by title..."
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            maxWidth: '600px',
                            bgcolor: 'rgba(255,255,255,0.95)',
                            borderRadius: '50px',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '50px',
                                '& fieldset': { border: 'none' },
                            },
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>
            </Box>

            {/* --- Main Content Area --- */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Tag Filtering Section */}
                <Box sx={{ mb: 4, display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', mr: 1 }}>Filter by Topic:</Typography>
                    {tags.map(tag => (
                        <Chip
                            key={tag}
                            icon={getTagIcon(tag)}
                            label={tag}
                            onClick={() => handleTagClick(tag)}
                            variant={selectedTag === tag ? 'filled' : 'outlined'}
                            color="primary"
                            clickable
                            sx={{ fontWeight: 'medium' }}
                        />
                    ))}
                </Box>

                {/* Post Results Section */}
                {loading && <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>}
                {error && <Alert severity="error">{error}</Alert>}
                {!loading && posts.length === 0 && <Typography sx={{ textAlign: 'center', mt: 4 }}>No posts found.</Typography>}
                
                <Grid container spacing={4}>
                    {posts.map(post => (
                        <Grid item key={post._id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                            <PostCard 
                                post={post} 
                                onLike={handleLike}
                                isLiked={user ? post.likes.includes(user._id) : false}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Container>
    );
};

export default ExplorePage;