// import React, { useState, useEffect } from 'react';
// import API from '../../api/axios';
// import {
//   Typography, Paper, Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, IconButton, Box, CircularProgress, Alert,
//   Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel
// } from '@mui/material';
// import {
//   Delete as DeleteIcon,
//   Edit as EditIcon,
//   Add as AddIcon
// } from '@mui/icons-material';

// const modalStyle = {
//   position: 'absolute',
//   top: '50%', left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };

// const AdminUserPage = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [open, setOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentUser, setCurrentUser] = useState({
//     name: '', email: '', password: '', role: 'user'
//   });

//   const fetchUsers = async () => {
//     try {
//       const { data } = await API.get('/admin/users');
//       setUsers(data);
//     } catch (err) {
//       setError('Failed to fetch users.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchUsers(); }, []);

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user and all their content?')) {
//       try {
//         await API.delete(`/admin/users/${userId}`);
//         fetchUsers();
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to delete user.');
//       }
//     }
//   };

//   const handleOpen = (user = null) => {
//     setIsEditMode(!!user);
//     setCurrentUser(user ? { ...user, password: '' } : {
//       name: '', email: '', password: '', role: 'user'
//     });
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setError('');
//   };

//   const handleChange = (e) => {
//     setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (isEditMode) {
//         await API.put(`/admin/users/${currentUser._id}`, currentUser);
//       } else {
//         await API.post('/admin/users', currentUser);
//       }
//       fetchUsers();
//       handleClose();
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to save user.');
//     }
//   };

//   if (loading) {
//     return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
//   }

//   return (
//     <Box>
//       <Box sx={{
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         mb: 2
//       }}>
//         <Typography variant="h4" gutterBottom>Manage Users</Typography>
//         <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
//           Add User
//         </Button>
//       </Box>

//       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Name</TableCell>
//               <TableCell>Email</TableCell>
//               <TableCell>Role</TableCell>
//               <TableCell>Joined</TableCell>
//               <TableCell align="right">Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {users.map((user) => (
//               <TableRow key={user._id}>
//                 <TableCell>{user.name}</TableCell>
//                 <TableCell>{user.email}</TableCell>
//                 <TableCell>{user.role}</TableCell>
//                 <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
//                 <TableCell align="right">
//                   <IconButton onClick={() => handleOpen(user)} color="primary">
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDeleteUser(user._id)} color="error">
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Add/Edit Modal */}
//       <Modal open={open} onClose={handleClose}>
//         <Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
//           <Typography variant="h6" component="h2" gutterBottom>
//             {isEditMode ? 'Edit User' : 'Add New User'}
//           </Typography>

//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Name"
//             name="name"
//             value={currentUser.name}
//             onChange={handleChange}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             label="Email"
//             name="email"
//             type="email"
//             value={currentUser.email}
//             onChange={handleChange}
//           />
//           {!isEditMode && (
//             <TextField
//               margin="normal"
//               required
//               fullWidth
//               label="Password"
//               name="password"
//               type="password"
//               value={currentUser.password}
//               onChange={handleChange}
//             />
//           )}
//           <FormControl fullWidth margin="normal">
//             <InputLabel>Role</InputLabel>
//             <Select
//               name="role"
//               value={currentUser.role}
//               label="Role"
//               onChange={handleChange}
//             >
//               <MenuItem value="user">User</MenuItem>
//               <MenuItem value="admin">Admin</MenuItem>
//             </Select>
//           </FormControl>

//           <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
//             {isEditMode ? 'Save Changes' : 'Create User'}
//           </Button>
//         </Box>
//       </Modal>
//     </Box>
//   );
// };

// export default AdminUserPage;
import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Box, CircularProgress, Alert, Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

const style = {
  position: 'absolute', top: '50%', left: '50%',
  transform: 'translate(-50%, -50%)', width: 400,
  bgcolor: 'background.paper', border: '2px solid #000',
  boxShadow: 24, p: 4,
};

const AdminUserPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [open, setOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentUser, setCurrentUser] = useState({ name: '', email: '', password: '', role: 'user' });

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/admin/users');
            setUsers(data);
        } catch (err) {
            setError('Failed to fetch users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure?')) {
            try {
                await API.delete(`/admin/users/${userId}`);
                fetchUsers();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete user.');
            }
        }
    };

    const handleOpen = (user = null) => {
        if (user) {
            setIsEditMode(true);
            setCurrentUser({ ...user, password: '' });
        } else {
            setIsEditMode(false);
            setCurrentUser({ name: '', email: '', password: '', role: 'user' });
        }
        setOpen(true);
    };
    
    const handleClose = () => setOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await API.put(`/admin/users/${currentUser._id}`, currentUser);
            } else {
                await API.post('/admin/users', currentUser);
            }
            fetchUsers();
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save user.');
        }
    };
    
    const handleChange = (e) => setCurrentUser({ ...currentUser, [e.target.name]: e.target.value });
    
    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" gutterBottom>Manage Users</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add User</Button>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                           <TableCell>Name</TableCell>
                           <TableCell>Email</TableCell>
                           <TableCell>Role</TableCell>
                           <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user._id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell align="right">
                                    <IconButton onClick={() => handleOpen(user)} color="primary"><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDeleteUser(user._id)} color="error"><DeleteIcon /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Modal open={open} onClose={handleClose}>
                <Box sx={style} component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" component="h2">{isEditMode ? 'Edit User' : 'Add New User'}</Typography>
                    <TextField margin="normal" required fullWidth label="Name" name="name" value={currentUser.name} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth label="Email" name="email" type="email" value={currentUser.email} onChange={handleChange} />
                    {!isEditMode && <TextField margin="normal" required fullWidth label="Password" name="password" type="password" value={currentUser.password} onChange={handleChange} />}
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Role</InputLabel>
                        <Select name="role" value={currentUser.role} label="Role" onChange={handleChange}>
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>{isEditMode ? 'Save Changes' : 'Create User'}</Button>
                </Box>
            </Modal>
        </Box>
    );
};

// Ensure this line is at the end of your file
export default AdminUserPage;