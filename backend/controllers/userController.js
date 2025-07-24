const User = require('../models/User');
const Post = require('../models/Post');
const asyncHandler = require('../middleware/asyncHandler');

exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const posts = await Post.find({ user: user._id, status: 'published' })
        .sort({ createdAt: -1 })
        .populate('user', 'name profilePicture');
    res.status(200).json({ user, posts });
});

exports.updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        if (req.file) {
            user.profilePicture = req.file.path;
        }
        const updatedUser = await user.save();
        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            bio: updatedUser.bio,
            profilePicture: updatedUser.profilePicture,
            role: updatedUser.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});