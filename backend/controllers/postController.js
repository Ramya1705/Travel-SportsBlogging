const Post = require('../models/Post');
const Comment = require('../models/Comment');
const asyncHandler = require('../middleware/asyncHandler');

const postController = {};

// @desc    Create a new post
postController.createPost = asyncHandler(async (req, res) => {
    const { title, content, status, tags } = req.body;
    const postData = {
        title,
        content,
        status,
        user: req.user.id,
        tags: [],
    };

    if (tags && typeof tags === 'string') {
        postData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    if (req.file) {
        postData.coverImage = req.file.path;
    }

    const post = await Post.create(postData);
    res.status(201).json(post);
});

// @desc    Update a post
postController.updatePost = asyncHandler(async (req, res) => {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Permission check: owner or admin
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, content, status, tags } = req.body;
    const updatedData = { title, content, status };

    if (tags && typeof tags === 'string') {
        updatedData.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    if (req.file) {
        updatedData.coverImage = req.file.path;
    }

    post = await Post.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true });
    res.status(200).json(post);
});

// @desc    Delete a post
postController.deletePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Permission check: owner or admin
    if (post.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    await Comment.deleteMany({ post: post._id });
    await post.remove();
    res.status(200).json({ message: 'Post deleted' });
});

// @desc    Get all published posts (with optional filters)
postController.getAllPosts = asyncHandler(async (req, res) => {
    const { tag, search } = req.query;
    const query = { status: 'published' };

    if (tag) query.tags = tag;
    if (search) query.title = { $regex: search, $options: 'i' };

    const posts = await Post.find(query)
        .sort({ createdAt: -1 })
        .populate('user', 'name profilePicture');

    res.status(200).json(posts);
});

// @desc    Get post by ID
postController.getPostById = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id).populate('user', 'name profilePicture');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
});

// @desc    Like or unlike a post
postController.likePost = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const isLiked = post.likes.some(like => like.equals(req.user.id));

    if (isLiked) {
        post.likes = post.likes.filter(like => !like.equals(req.user.id));
    } else {
        post.likes.push(req.user.id);
    }

    await post.save();
    res.status(200).json(post.likes);
});

// @desc    Add a comment to a post
postController.addComment = asyncHandler(async (req, res) => {
    const { content, parentCommentId } = req.body;

    const comment = await Comment.create({
        post: req.params.id,
        user: req.user.id,
        content,
        parentComment: parentCommentId || null,
    });

    const populatedComment = await comment.populate('user', 'name profilePicture');
    res.status(201).json(populatedComment);
});

// @desc    Get all comments for a post
postController.getPostComments = asyncHandler(async (req, res) => {
    const comments = await Comment.find({ post: req.params.id })
        .populate('user', 'name profilePicture')
        .sort({ createdAt: 'asc' });

    res.status(200).json(comments);
});

// @desc    Delete a comment
postController.deleteComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Permission check: owner or admin
    if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    // Delete nested replies
    await Comment.deleteMany({ parentComment: req.params.commentId });
    await comment.remove();
    res.status(200).json({ message: 'Comment deleted' });
});

// @desc    Get all unique tags
postController.getAllTags = asyncHandler(async (req, res) => {
    const tags = await Post.distinct('tags', { status: 'published' });
    res.status(200).json(tags);
});

module.exports = postController;
