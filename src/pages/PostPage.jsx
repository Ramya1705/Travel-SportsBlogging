import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';

// Import Material-UI components & Icons
import { Container, Typography, Box, Avatar, CircularProgress, Alert, IconButton, Button, TextField, Card, CardHeader, CardMedia, CardContent, Divider } from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubbleOutline as CommentIcon, Delete as DeleteIcon } from '@mui/icons-material';

// --- Instagram-style Comment Component ---
const Comment = ({ comment, onDelete }) => {
    const { user } = useContext(AuthContext);
    
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
            <Avatar src={comment.user.profilePicture} sx={{ width: 32, height: 32, mr: 2 }} component={Link} to={`/profile/${comment.user._id}`} />
            <Box>
                <Typography variant="body2">
                    <Typography component={Link} to={`/profile/${comment.user._id}`} sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit', mr: 1 }}>
                        {comment.user.name}
                    </Typography>
                    {comment.content}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </Typography>
                    {(user?._id === comment.user._id || user?.role === 'admin') && 
                        <Button size="small" color="error" sx={{ p:0, m:0, ml: 2, fontWeight: 'bold', minWidth: 'auto' }} onClick={() => onDelete(comment._id)}>
                            Delete
                        </Button>
                    }
                </Box>
            </Box>
        </Box>
    );
};

// --- Main Post Page Component ---
const PostPage = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // State management
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showAllComments, setShowAllComments] = useState(false); // New state to control comment visibility
    const commentInputRef = useRef(null);

    // Fetch all post and comment data
    useEffect(() => {
        const fetchPostData = async () => {
            setLoading(true);
            try {
                const [postRes, commentsRes] = await Promise.all([
                    API.get(`/posts/${id}`),
                    API.get(`/posts/${id}/comments`)
                ]);
                setPost(postRes.data);
                setLikes(postRes.data.likes);
                setIsLiked(postRes.data.likes.includes(user?._id));
                setComments(commentsRes.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))); // Show oldest comments first
            } catch (err) {
                setError('Failed to load post.');
            } finally {
                setLoading(false);
            }
        };
        fetchPostData();
    }, [id, user?._id]);

    const handleLike = async () => {
        if (!user) return navigate('/login');
        try {
            const { data } = await API.put(`/posts/${id}/like`);
            setLikes(data);
            setIsLiked(data.includes(user._id));
        } catch (err) { console.error('Failed to like post', err); }
    };
    
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        try {
            const { data } = await API.post(`/posts/${id}/comments`, { content: newComment });
            setComments([...comments, data]); // Add new comment to the end of the list
            setNewComment('');
        } catch (err) { console.error('Failed to post comment', err); }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure?')) {
            try {
                await API.delete(`/posts/${id}/comments/${commentId}`);
                setComments(comments.filter(c => c._id !== commentId));
            } catch (err) { console.error('Failed to delete comment', err); }
        }
    };
    
    const focusAndShowComments = () => {
        setShowAllComments(true);
        // Use a short timeout to ensure the comment section is rendered before focusing
        setTimeout(() => {
            commentInputRef.current?.focus();
        }, 100);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    if (error) return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;
    if (!post) return null;

    return (
        <Container maxWidth="sm" sx={{ p: { xs: 0, sm: 2 } }}>
            <Card sx={{ border: '1px solid #dbdbdb', boxShadow: 'none', borderRadius: { xs: 0, sm: 3 } }}>
                <CardHeader
                    avatar={<Avatar src={post.user.profilePicture} component={Link} to={`/profile/${post.user._id}`} />}
                    title={<Typography variant="subtitle2" component={Link} to={`/profile/${post.user._id}`} sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit' }}>{post.user.name}</Typography>}
                />
                <CardMedia component="img" image={post.coverImage} alt={post.title} />
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <IconButton onClick={handleLike} sx={{ p: 1, ml: -1 }}>{isLiked ? <Favorite sx={{ color: '#ff3d71' }} /> : <FavoriteBorder />}</IconButton>
                        <IconButton onClick={focusAndShowComments} sx={{ p: 1 }}><CommentIcon /></IconButton>
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>{likes.length} {likes.length === 1 ? 'like' : 'likes'}</Typography>
                    
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        <Typography component="span" sx={{ fontWeight: 'bold', textDecoration: 'none', color: 'inherit', mr: 1 }}>
                            {post.user.name}
                        </Typography>
                        {post.title}
                    </Typography>

                    {/* --- Conditional Comment Rendering Logic --- */}
                    {comments.length > 0 && (
                        !showAllComments ? (
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                onClick={() => setShowAllComments(true)} 
                                sx={{ cursor: 'pointer', mt: 1 }}
                            >
                                View all {comments.length} comments
                            </Typography>
                        ) : (
                            <Box sx={{ mt: 2, maxHeight: '250px', overflowY: 'auto', pr: 1 }}>
                                {comments.map(comment => (
                                    <Comment key={comment._id} comment={comment} onDelete={handleDeleteComment} />
                                ))}
                            </Box>
                        )
                    )}
                    {/* --- End of Conditional Logic --- */}

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }).toUpperCase()}
                    </Typography>
                </CardContent>

                <Divider />
                <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', p: 1.5, alignItems: 'center' }}>
                    <Avatar src={user?.profilePicture} sx={{ width: 32, height: 32, mr: 1.5 }} />
                    <TextField
                        inputRef={commentInputRef}
                        fullWidth
                        variant="standard"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        InputProps={{ disableUnderline: true }}
                    />
                    <Button type="submit" sx={{ fontWeight: 'bold' }} disabled={!newComment.trim()}>Post</Button>
                </Box>
            </Card>
        </Container>
    );
};

export default PostPage;