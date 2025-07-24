const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    // Add the new field here
    coverImage: { type: String, default: 'https://placehold.co/1200x600/2ECC71/FFFFFF?text=NexusBlogs' },
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    tags: [{ type: String, trim: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);