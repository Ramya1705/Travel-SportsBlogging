const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/cloudinary');

router.get('/:userId', getUserProfile);
router.put('/profile', protect, upload.single('profilePicture'), updateUserProfile);

module.exports = router;