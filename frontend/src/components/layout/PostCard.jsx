import React from 'react';
import { Card, CardContent, Typography, CardActions, Box, Avatar, CardMedia, IconButton, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const PostCard = ({ post, onLike, isLiked }) => {
    if (!post || !post.user) {
        return null; 
    }

    const createSnippet = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent?.slice(0, 80) + '...' || "";
    };

    return (
        <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 3, borderRadius: 2 }}>
            <CardActionArea component={Link} to={`/post/${post._id}`} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                    component="img"
                    height="180"
                    image={post.coverImage}
                    alt={post.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {createSnippet(post.content)}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1, mt: 'auto' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar component={Link} to={`/profile/${post.user._id}`} src={post.user.profilePicture} sx={{ width: 32, height: 32, mr: 1 }} />
                    <Typography variant="body2" component={Link} to={`/profile/${post.user._id}`} sx={{ textDecoration: 'none', color: 'inherit' }}>
                        {post.user.name}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => onLike(post._id)} size="small">
                        {isLiked ? <Favorite color="error" /> : <FavoriteBorder />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {post.likes.length}
                    </Typography>
                </Box>
            </CardActions>
        </Card>
    );
};

export default PostCard;