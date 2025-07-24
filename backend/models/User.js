const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    googleId: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: 'https://placehold.co/200x200/2ECC71/FFFFFF?text=User',
    },
    bio: {
        type: String,
        maxlength: 500,
        default: '',
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true,
});

/**
 * Pre-save middleware to hash password if modified
 */
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

/**
 * Match entered password with hashed password
 */
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

/**
 * Generate and store a password reset token
 */
UserSchema.methods.getResetPasswordToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    return token;
};

/**
 * Generate and store an email verification token
 */
UserSchema.methods.getVerificationToken = function () {
    const token = crypto.randomBytes(20).toString('hex');
    this.verificationToken = crypto.createHash('sha256').update(token).digest('hex');
    this.verificationTokenExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    return token;
};

module.exports = mongoose.model('User', UserSchema);
