const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary'); // Import the upload middleware
const {
    createPost, getAllPosts, getPostById, updatePost, deletePost, likePost,
    addComment, getPostComments, deleteComment, getAllTags
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

// Apply middleware to handle 'coverImage' file upload
router.route('/')
    .post(protect, upload.single('coverImage'), createPost)
    .get(getAllPosts);

router.get('/tags', getAllTags);

router.route('/:id')
    .get(getPostById)
    // Apply middleware to handle 'coverImage' file upload
    .put(protect, upload.single('coverImage'), updatePost)
    .delete(protect, deletePost);
    
router.put('/:id/like', protect, likePost);
router.route('/:id/comments').post(protect, addComment).get(getPostComments);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;