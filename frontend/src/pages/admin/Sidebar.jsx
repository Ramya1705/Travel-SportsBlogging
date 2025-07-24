import React, { useContext } from 'react';
import { Box, List, ListItemIcon, ListItemText, Avatar, Typography, Divider, Button } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Dashboard as DashboardIcon, People as PeopleIcon, Article as PostIcon, Comment as CommentIcon, Logout as LogoutIcon, Edit as EditIcon } from '@mui/icons-material';

// The sidebar now receives a prop to handle opening the modal
const Sidebar = ({ onEditProfile }) => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const navItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
        { text: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
        { text: 'Posts', icon: <PostIcon />, path: '/admin/posts' },
        { text: 'Comments', icon: <CommentIcon />, path: '/admin/comments' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkStyles = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '12px 20px',
        borderRadius: '8px',
        textDecoration: 'none',
        color: isActive ? '#fff' : '#a9b5cf',
        backgroundColor: isActive ? 'rgba(0, 123, 255, 0.5)' : 'transparent',
        marginBottom: '8px',
        transition: 'background-color 0.2s, color 0.2s',
        '&:hover': {
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            color: '#fff',
        }
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>NexusBlogs</Typography>
            </Box>
            <Divider sx={{ bgcolor: '#2e3d54' }} />
            
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Avatar src={user?.profilePicture} sx={{ width: 64, height: 64, margin: '0 auto 16px', border: '2px solid #007BFF' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{user?.name}</Typography>
                <Typography variant="body2" color="#a9b5cf">Administrator</Typography>
                {/* Add Edit Profile Button Here */}
                <Button
                    onClick={onEditProfile}
                    size="small"
                    startIcon={<EditIcon />}
                    sx={{ mt: 1, color: '#a9b5cf', textTransform: 'none', '&:hover': { bgcolor: 'rgba(0, 123, 255, 0.2)', color: '#fff' } }}
                >
                    Edit Profile
                </Button>
            </Box>
            <Divider sx={{ bgcolor: '#2e3d54' }} />

            <List sx={{ p: 2, flexGrow: 1 }}>
                {navItems.map((item) => (
                    <NavLink to={item.path} key={item.text} end style={navLinkStyles}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </NavLink>
                ))}
            </List>
            
            <Button onClick={handleLogout} variant="text" startIcon={<LogoutIcon />} sx={{ m: 2, color: '#a9b5cf', '&:hover': { bgcolor: 'rgba(255,0,0,0.1)', color: '#ff3d71' } }}>
                Logout
            </Button>
        </Box>
    );
};

export default Sidebar;