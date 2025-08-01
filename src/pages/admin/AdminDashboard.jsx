// import React, { useState, useEffect } from 'react';
// import API from '../../api/axios';
// import { Typography, Grid, Card, CardContent, Box, CircularProgress, Alert } from '@mui/material';
// import { People as PeopleIcon, Article as PostIcon, Comment as CommentIcon } from '@mui/icons-material';

// const StatCard = ({ title, value, icon, color }) => (
//     <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
//         <Box sx={{
//             bgcolor: color,
//             borderRadius: '50%',
//             p: 1.5,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             mr: 2,
//         }}>
//             {icon}
//         </Box>
//         <Box>
//             <Typography color="text.secondary">{title}</Typography>
//             <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
//         </Box>
//     </Card>
// );

// const AdminDashboard = () => {
//     const [analytics, setAnalytics] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');

//     useEffect(() => {
//         const fetchAnalytics = async () => {
//             try {
//                 const { data } = await API.get('/admin/analytics');
//                 setAnalytics(data);
//             } catch (err) {
//                 setError('Failed to load platform analytics.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchAnalytics();
//     }, []);
    
//     if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
//     if (error) return <Alert severity="error">{error}</Alert>;

//     return (
//         <Box>
//             <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Welcome back, Admin!</Typography>
//             <Grid container spacing={3}>
//                 <Grid item xs={12} md={4}>
//                     <StatCard 
//                         title="Total Users" 
//                         value={analytics?.totalUsers} 
//                         icon={<PeopleIcon sx={{ color: '#fff', fontSize: 28 }} />} 
//                         color="primary.main" 
//                     />
//                 </Grid>
//                 <Grid item xs={12} md={4}>
//                     <StatCard 
//                         title="Total Posts" 
//                         value={analytics?.totalPosts} 
//                         icon={<PostIcon sx={{ color: '#fff', fontSize: 28 }} />} 
//                         color="#ff9800" // Orange
//                     />
//                 </Grid>
//                  <Grid item xs={12} md={4}>
//                     <StatCard 
//                         title="Total Comments" 
//                         value={analytics?.totalComments} 
//                         icon={<CommentIcon sx={{ color: '#fff', fontSize: 28 }} />} 
//                         color="#4caf50" // Green
//                     />
//                 </Grid>
//             </Grid>
//         </Box>
//     );
// };

// export default AdminDashboard;/
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Typography, Grid, Card, CardContent, Box, CircularProgress, Alert } from '@mui/material';
import { People as PeopleIcon, Article as PostIcon, Comment as CommentIcon } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        <Box sx={{ bgcolor: color, borderRadius: '50%', p: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2, }}>
            {icon}
        </Box>
        <Box>
            <Typography color="text.secondary">{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Box>
    </Card>
);

const AdminDashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const { data } = await API.get('/admin/analytics');
                setAnalytics(data);
            } catch (err) {
                setError('Failed to load platform analytics.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Welcome back, Admin!</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                    <StatCard title="Total Users" value={analytics?.totalUsers} icon={<PeopleIcon sx={{ color: '#fff', fontSize: 28 }} />} color="primary.main" />
                </Grid>
                <Grid item xs={12} md={4}>
                    <StatCard title="Total Posts" value={analytics?.totalPosts} icon={<PostIcon sx={{ color: '#fff', fontSize: 28 }} />} color="#ff9800" />
                </Grid>
                 <Grid item xs={12} md={4}>
                    <StatCard title="Total Comments" value={analytics?.totalComments} icon={<CommentIcon sx={{ color: '#fff', fontSize: 28 }} />} color="#4caf50" />
                </Grid>
            </Grid>
        </Box>
    );
};

// Make sure this line is at the very end of the file
export default AdminDashboard;