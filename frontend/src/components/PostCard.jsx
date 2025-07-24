import React from 'react';
import './PostCard.css';
import { 
    Card, 
    CardContent, 
    Typography, 
    CardActions, 
    Box, 
    Avatar, 
    CardMedia, 
    IconButton, 
    CardActionArea,
    Chip,
    Fade
} from '@mui/material';
import { Link } from 'react-router-dom';
import { 
    Favorite, 
    FavoriteBorder, 
    TravelExplore, 
    SportsSoccer,
    AccessTime,
    Visibility
} from '@mui/icons-material';

const PostCard = ({ post, onLike, isLiked }) => {
    if (!post || !post.user) {
        return null;
    }

    const createSnippet = (html) => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent?.slice(0, 80) + '...' || "";
    };

    return (
        <Fade in timeout={600}>
            <Card 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    height: '400px', // Fixed height for consistency
                    width: '320px', // Fixed width for consistency
                    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)',
                    borderRadius: '16px',
                    background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)',
                    border: '1px solid rgba(25, 118, 210, 0.1)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(25, 118, 210, 0.25)',
                        '& .card-media': {
                            transform: 'scale(1.05)'
                        },
                        '& .card-overlay': {
                            opacity: 1
                        }
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, #1976d2, #42a5f5, #1976d2)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s ease-in-out infinite'
                    },
                    '@keyframes shimmer': {
                        '0%': { backgroundPosition: '-200% 0' },
                        '100%': { backgroundPosition: '200% 0' }
                    }
                }}
            >
                <CardActionArea 
                    component={Link} 
                    to={`/post/${post._id}`} 
                    sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        height: '100%',
                        position: 'relative'
                    }}
                >
                    <Box sx={{ position: 'relative', overflow: 'hidden', height: '180px' }}>
                        <CardMedia
                            component="img"
                            className="card-media"
                            sx={{
                                height: '100%',
                                width: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                            image={post.coverImage}
                            alt={post.title}
                        />
                        <Box 
                            className="card-overlay"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(135deg, rgba(25, 118, 210, 0.1), rgba(66, 165, 245, 0.1))',
                                opacity: 0,
                                transition: 'opacity 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <Visibility sx={{ color: 'white', fontSize: 32 }} />
                        </Box>

                    </Box>

                    <CardContent sx={{ 
                        flexGrow: 1, 
                        display: 'flex',
                        flexDirection: 'column',
                        p: 2,
                        height: 'calc(100% - 180px - 64px)' // Remaining height after media and actions
                    }}>
                        <Typography 
                            gutterBottom 
                            variant="h6" 
                            component="h2" 
                            sx={{ 
                                fontWeight: 700,
                                color: '#1565c0',
                                lineHeight: 1.3,
                                mb: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                minHeight: '2.6em' // Ensure consistent title height
                            }}
                        >
                            {post.title}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{
                                color: '#546e7a',
                                lineHeight: 1.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                flex: 1
                            }}
                        >
                            {createSnippet(post.content)}
                        </Typography>
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            mt: 1,
                            pt: 1,
                            borderTop: '1px solid rgba(25, 118, 210, 0.1)'
                        }}>
                            <AccessTime sx={{ fontSize: 14, color: '#90a4ae', mr: 0.5 }} />
                            <Typography variant="caption" color="text.secondary">
                                5 min read
                            </Typography>
                            <SportsSoccer sx={{ fontSize: 14, color: '#1976d2', ml: 'auto' }} />
                        </Box>
                    </CardContent>
                </CardActionArea>

                <CardActions sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    p: 2, 
                    mt: 'auto',
                    background: 'linear-gradient(90deg, rgba(25, 118, 210, 0.02), rgba(66, 165, 245, 0.02))',
                    borderTop: '1px solid rgba(25, 118, 210, 0.08)',
                    height: '64px' // Fixed height for consistency
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                        <Avatar 
                            component={Link} 
                            to={`/profile/${post.user._id}`} 
                            src={post.user.profilePicture} 
                            sx={{ 
                                width: 36, 
                                height: 36, 
                                mr: 1.5,
                                border: '2px solid #e3f2fd',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    border: '2px solid #1976d2',
                                    transform: 'scale(1.1)'
                                }
                            }} 
                        />
                        <Typography 
                            variant="body2" 
                            component={Link} 
                            to={`/profile/${post.user._id}`} 
                            sx={{ 
                                textDecoration: 'none', 
                                color: '#1565c0',
                                fontWeight: 600,
                                transition: 'color 0.2s ease',
                                '&:hover': {
                                    color: '#0d47a1'
                                }
                            }}
                        >
                            {post.user.name}
                        </Typography>
                    </Box>
                    <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        background: 'rgba(25, 118, 210, 0.05)',
                        borderRadius: '20px',
                        px: 1,
                        py: 0.5
                    }}>
                        <IconButton 
                            onClick={() => onLike(post._id)} 
                            size="small"
                            sx={{
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                    background: 'rgba(244, 67, 54, 0.1)',
                                    transform: 'scale(1.1)'
                                }
                            }}
                        >
                            {isLiked ? 
                                <Favorite sx={{ color: '#f44336', fontSize: 20 }} /> : 
                                <FavoriteBorder sx={{ color: '#1976d2', fontSize: 20 }} />
                            }
                        </IconButton>
                        <Typography 
                            variant="body2" 
                            sx={{
                                color: '#1976d2',
                                fontWeight: 600,
                                minWidth: '20px',
                                textAlign: 'center'
                            }}
                        >
                            {post.likes.length}
                        </Typography>
                    </Box>
                </CardActions>
            </Card>
        </Fade>
    );
};

export default PostCard;