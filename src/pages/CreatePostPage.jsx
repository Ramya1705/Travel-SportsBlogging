import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../api/axios';

// Import Material-UI components & Icons
import { Container, TextField, Button, Box, Typography, Alert, Paper, styled } from '@mui/material';
import { PhotoCamera as PhotoCameraIcon, Publish as PublishIcon, Explore as ExploreIcon } from '@mui/icons-material';

// --- Styled Component for the Frosted Glass Effect ---
const GlassPaper = styled(Paper)({
    padding: '32px',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Slightly more opaque for better readability
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
});

const CreatePostPage = ({ editMode = false }) => {
    // State and handler functions (no changes to logic)
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [coverImage, setCoverImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();
    const quillRef = useRef();

    useEffect(() => {
        if (editMode && id) {
            const fetchPost = async () => {
                try {
                    const { data } = await API.get(`/posts/${id}`);
                    setTitle(data.title);
                    setContent(data.content);
                    setTags(data.tags.join(', '));
                    setPreview(data.coverImage);
                } catch (err) {
                    setError('Failed to load post for editing.');
                }
            };
            fetchPost();
        }
    }, [editMode, id]);

    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };
    
    const handleSave = async (status) => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('status', status);
        formData.append('tags', tags);
        if (coverImage) formData.append('coverImage', coverImage);

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            const response = editMode 
                ? await API.put(`/posts/${id}`, formData, config)
                : await API.post('/posts', formData, config);
            navigate(`/post/${response.data._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save post');
        }
    };
    
    const imageHandler = () => { /* ... (logic remains the same) */ };
    const modules = useMemo(() => ({ /* ... (logic remains the same) */ }), []);

    return (
        <Box sx={{
            position: 'relative',
            minHeight: 'calc(100vh - 64px)', // Adjust for navbar height
            py: 5,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&::before': { // The blurred background image
                content: '""',
                position: 'absolute',
                top: -20, left: -20, right: -20, bottom: -20,
                backgroundImage: 'url(https://images.unsplash.com/photo-1505118380757-91f5f5632de0?q=80&w=1974)', // Blue travel/sports background
                backgroundSize: 'cover',
                backgroundAttachment: 'fixed',
                filter: 'blur(8px)',
                zIndex: -2,
            },
            '&::after': { // The blue color overlay
                content: '""',
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '100%',
                background: 'linear-gradient(to bottom, rgba(0, 91, 234, 0.4), rgba(0, 30, 70, 0.6))',
                zIndex: -1,
            }
        }}>
            <Container maxWidth="md">
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: 'white' }}>
                    <ExploreIcon color="inherit" sx={{ fontSize: '2.5rem', mr: 1.5 }}/>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.6)' }}>
                        {editMode ? 'Refine Your Adventure' : 'Craft Your Next Adventure'}
                    </Typography>
                </Box>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* --- Single Card Layout --- */}
                <GlassPaper>
                    <TextField
                        label="Post Title"
                        fullWidth
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button fullWidth variant="outlined" component="label" startIcon={<PhotoCameraIcon />} sx={{ mb: 2 }}>
                        Set Featured Image
                        <input type="file" hidden accept="image/*" onChange={handleCoverImageChange} />
                    </Button>
                    {preview && (
                        <Box mb={3} sx={{ border: '1px dashed #ccc', p: 1, borderRadius: 1 }}>
                            <img src={preview} alt="Cover preview" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '4px' }} />
                        </Box>
                    )}

                    <TextField
                        label="Tags (comma-separated)"
                        fullWidth
                        variant="outlined"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        helperText="e.g., travel, sports, hiking"
                        sx={{ mb: 3 }}
                    />
                    
                    <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={content}
                        onChange={setContent}
                        modules={modules}
                        style={{ height: '400px', marginBottom: '50px' }}
                    />

                    <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                        <Button fullWidth variant="outlined" color="primary" onClick={() => handleSave('draft')}>
                            Save Draft
                        </Button>
                        <Button fullWidth variant="contained" color="primary" endIcon={<PublishIcon />} onClick={() => handleSave('published')}>
                            Upload Post
                        </Button>
                    </Box>
                </GlassPaper>
            </Container>
        </Box>
    );
};

export default CreatePostPage;