import React, { useState } from 'react'; // Import useState
import { Box, Drawer, AppBar, Toolbar, Typography } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminProfileModal from './AdminProfileModal'; // Import the new modal

const drawerWidth = 280;

const getPageTitle = (pathname) => { /* ... (function remains the same) */ };

const AdminLayout = () => {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    // State and handlers for the profile edit modal
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const handleOpenProfileModal = () => setProfileModalOpen(true);
    const handleCloseProfileModal = () => setProfileModalOpen(false);

    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#1c2536', color: 'white', borderRight: 'none' },
                }}
            >
                {/* Pass the handler function as a prop to the Sidebar */}
                <Sidebar onEditProfile={handleOpenProfileModal} />
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, width: `calc(100% - ${drawerWidth}px)` }}>
                <AppBar
                    position="static"
                    elevation={0}
                    sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: '1px solid #e0e0e0' }}
                >
                    <Toolbar>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{pageTitle}</Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: 3, bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)' }}>
                    <Outlet />
                </Box>
            </Box>

            {/* Render the modal when its state is open */}
            {profileModalOpen && <AdminProfileModal open={profileModalOpen} handleClose={handleCloseProfileModal} />}
        </Box>
    );
};

export default AdminLayout;
