const express = require('express');
const router = express.Router();
const {
    getPlatformAnalytics,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    adminDeletePost,
    getAllComments,
    deleteComment
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

// Analytics
router.get('/analytics', getPlatformAnalytics);

// User Management
router.route('/users')
    .get(getAllUsers)
    .post(createUser);

router.route('/users/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

// Post Management
router.delete('/posts/:id', adminDeletePost);

// Comment Management
router.route('/comments')
    .get(getAllComments);

router.route('/comments/:id')
    .delete(deleteComment);

module.exports = router;