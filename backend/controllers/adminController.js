const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const asyncHandler = require('../middleware/asyncHandler');

// --- Analytics ---
// @desc    Get platform analytics
// @route   GET /api/admin/analytics
exports.getPlatformAnalytics = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalComments = await Comment.countDocuments();
    res.status(200).json({ totalUsers, totalPosts, totalComments });
});

// --- User Management ---
// @desc    Get all users (excluding the current admin)
// @route   GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({ _id: { $ne: req.user.id } }).select('-password');
    res.status(200).json(users);
});

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Admin creates a new user
// @route   POST /api/admin/users
exports.createUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, role });
    res.status(201).json(user);
});

// @desc    Admin updates a user
// @route   PUT /api/admin/users/:id
exports.updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

// @desc    Admin deletes a user and their content
// @route   DELETE /api/admin/users/:id
exports.deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete an admin' });

    const posts = await Post.find({ user: user._id });
    const postIds = posts.map(p => p._id);
    
    await Comment.deleteMany({ $or: [{ post: { $in: postIds } }, { user: user._id }] });
    await Post.deleteMany({ user: user._id });
    await user.remove();

    res.status(200).json({ message: 'User and associated content deleted' });
});

// --- Post Management ---
// @desc    Admin deletes a post and its comments
// @route   DELETE /api/admin/posts/:id
exports.adminDeletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    await Comment.deleteMany({ post: post._id });
    await post.remove();

    res.status(200).json({ message: 'Post and related comments deleted' });
});

// --- Comment Management ---
// @desc    Get all comments
// @route   GET /api/admin/comments
exports.getAllComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({})
        .populate('user', 'name')
        .populate('post', 'title')
        .sort({ createdAt: -1 });

    res.status(200).json(comments);
});

// @desc    Admin deletes a comment
// @route   DELETE /api/admin/comments/:id
exports.deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
    }
    await comment.remove();
    res.status(200).json({ message: 'Comment removed' });
});
