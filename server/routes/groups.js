import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { checkRole } from '../middleware/rbac.js';
import Group from '../models/Group.js';
import GroupJoinRequest from '../models/GroupJoinRequest.js';
import GroupPost from '../models/GroupPost.js';

const router = express.Router();

// Get all groups
router.get('/', verifyToken, async (req, res) => {
    try {
        const groups = await Group.find()
            .populate('moderators', 'name email')
            .populate('members.user', 'name email')
            .lean();

        // Check user's join status for each group
        const groupsWithStatus = await Promise.all(groups.map(async (group) => {
            const joinRequest = await GroupJoinRequest.findOne({
                group: group._id,
                user: req.user.userId
            }).lean();

            return {
                ...group,
                isJoined: group.members.some(member =>
                    member.user && member.user._id.toString() === req.user.userId
                ),
                joinRequestStatus: joinRequest ? joinRequest.status : null
            };
        }));

        res.json(groupsWithStatus);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({
            message: 'Failed to fetch groups',
            error: error.message
        });
    }
});

// Request to join group
router.post('/:groupId/join', verifyToken, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { reason } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if already a member
        if (group.members.some(member => member.user.toString() === req.user.userId)) {
            return res.status(400).json({ message: 'Already a member of this group' });
        }

        // Create join request
        const joinRequest = new GroupJoinRequest({
            group: groupId,
            user: req.user.userId,
            reason
        });

        await joinRequest.save();
        res.status(201).json({ message: 'Join request submitted successfully' });
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Join request already exists' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});


// Get group posts
router.get('/:groupId/posts', verifyToken, async (req, res) => {
    try {
        const { groupId } = req.params;
        const posts = await GroupPost.find({ group: groupId })
            .populate('author', 'name email role')
            .populate('comments.author', 'name email role')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create post in group
router.post('/:groupId/posts', verifyToken, async (req, res) => {
    try {
        const { groupId } = req.params;
        const { title, content } = req.body;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Check if user is a member
        if (!group.members.some(member => member.user.toString() === req.user.userId)) {
            return res.status(403).json({ message: 'Only members can create posts' });
        }

        const post = new GroupPost({
            group: groupId,
            author: req.user.userId,
            title,
            content
        });

        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update post
router.put('/:groupId/posts/:postId', verifyToken, async (req, res) => {
    try {
        const { groupId, postId } = req.params;
        const { title, content } = req.body;

        const post = await GroupPost.findOne({ _id: postId, group: groupId });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author or admin
        if (post.author.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to edit this post' });
        }

        post.title = title || post.title;
        post.content = content;
        post.isEdited = true;
        post.updatedAt = new Date();

        await post.save();

        const updatedPost = await GroupPost.findById(post._id)
            .populate('author', 'name email role')
            .populate('comments.author', 'name email role');

        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete post
router.delete('/:groupId/posts/:postId', verifyToken, async (req, res) => {
    try {
        const { groupId, postId } = req.params;
        const post = await GroupPost.findOne({ _id: postId, group: groupId });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check if user is the author or admin
        if (post.author.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add comment to post
router.post('/:groupId/posts/:postId/comments', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { content, parentCommentId } = req.body;

        const post = await GroupPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = {
            author: req.user.userId,
            content,
            parentComment: parentCommentId || null
        };

        post.comments.push(comment);
        await post.save();

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Vote on post
router.post('/:groupId/posts/:postId/vote', verifyToken, async (req, res) => {
    try {
        const { postId } = req.params;
        const { voteType } = req.body; // 'up' or 'down'

        const post = await GroupPost.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const userId = req.user.userId;

        // Remove existing votes
        post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
        post.downvotes = post.downvotes.filter(id => id.toString() !== userId);

        // Add new vote
        if (voteType === 'up') {
            post.upvotes.push(userId);
        } else if (voteType === 'down') {
            post.downvotes.push(userId);
        }

        await post.save();
        res.json({ message: 'Vote recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Admin: Handle join requests
router.put('/:groupId/requests/:requestId', verifyToken, checkRole(['admin']), async (req, res) => {
    try {
        const { groupId, requestId } = req.params;
        const { status } = req.body;

        const joinRequest = await GroupJoinRequest.findById(requestId);
        if (!joinRequest) {
            return res.status(404).json({ message: 'Join request not found' });
        }

        joinRequest.status = status;
        await joinRequest.save();

        if (status === 'approved') {
            await Group.findByIdAndUpdate(groupId, {
                $push: { members: { user: joinRequest.user } }
            });
        }

        res.json({ message: `Join request ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;