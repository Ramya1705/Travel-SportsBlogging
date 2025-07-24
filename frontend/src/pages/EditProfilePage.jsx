import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { Container, TextField, Button, Typography, Box, Avatar, Alert, CircularProgress } from '@mui/material';

const EditProfilePage = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();
    
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
            const { data } = await API.put('/users/profile', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setUser(data);
            navigate(`/profile/${user._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Edit Profile</Typography>
                {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                        <Avatar src={preview} sx={{ width: 100, height: 100, mb: 1 }} />
                        <Button variant="contained" component="label">
                            Change Picture
                            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                        </Button>
                    </Box>
                    <TextField margin="normal" required fullWidth label="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField margin="normal" fullWidth label="Bio" multiline rows={4} value={bio} onChange={(e) => setBio(e.target.value)} />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default EditProfilePage;