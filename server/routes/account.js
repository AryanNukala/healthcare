import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import GroupPost from '../models/GroupPost.js';
import Resource from '../models/Resource.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Delete account and all associated data
router.delete('/', verifyToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete user's appointments
        await Appointment.deleteMany({
            $or: [
                { patient: userId },
                { doctor: userId }
            ]
        });

        // Delete user's group posts and comments
        await GroupPost.deleteMany({ author: userId });
        await GroupPost.updateMany(
            { 'comments.author': userId },
            { $pull: { comments: { author: userId } } }
        );

        // If user is a doctor, delete their resources
        if (user.role === 'doctor') {
            const resources = await Resource.find({ author: userId });

            // Delete resource files
            for (const resource of resources) {
                const filePath = path.join('uploads/resources', resource.fileName);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            await Resource.deleteMany({ author: userId });
        }

        // Finally, delete the user
        await user.deleteOne();

        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({ message: 'Failed to delete account' });
    }
});

export default router;