import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../api/axios';
import { Modal, Box, Typography, TextField, Button, Avatar, CircularProgress, Alert } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const AdminProfileModal = ({ open, handleClose }) => {
    const { user, setUser } = useContext(AuthContext);
    
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(user.profilePicture);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const formData = new FormData();
        formData.append('name', name);
        formData.append('bio', bio);
        if (profilePicture) formData.append('profilePicture', profilePicture);

        try {
            const { data } = await API.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUser(data); // Update global user state
            handleClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" component="h2">Edit Your Profile</Typography>
                {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2 }}>
                    <Avatar src={preview} sx={{ width: 100, height: 100, mb: 1 }} />
                    <Button variant="contained" component="label" size="small">
                        Change Picture
                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                    </Button>
                </Box>
                <TextField margin="normal" required fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                <TextField margin="normal" fullWidth label="Bio" multiline rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                </Button>
            </Box>
        </Modal>
    );
};

export default AdminProfileModal;