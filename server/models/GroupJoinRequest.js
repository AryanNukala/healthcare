import mongoose from 'mongoose';

const groupJoinRequestSchema = new mongoose.Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reason: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure unique join requests per user per group
groupJoinRequestSchema.index({ group: 1, user: 1 }, { unique: true });

export default mongoose.model('GroupJoinRequest', groupJoinRequestSchema);