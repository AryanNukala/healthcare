import express from 'express';
import { checkRole } from '../middleware/rbac.js';
import User from '../models/User.js';
import Group from '../models/Group.js';
import GroupJoinRequest from '../models/GroupJoinRequest.js';

const router = express.Router();

// Protect all admin routes
router.use(checkRole(['admin']));

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete user
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all doctors
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add new doctor
router.post('/doctors', async (req, res) => {
    try {
        const { name, email, password, specialization, licenseNumber } = req.body;

        const doctor = new User({
            name,
            email,
            password,
            role: 'doctor',
            profile: {
                specialization,
                licenseNumber,
                isApproved: false
            }
        });

        await doctor.save();
        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete doctor
router.delete('/doctors/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all groups
router.get('/groups', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new group
router.post('/groups', async (req, res) => {
    try {
        const { name, description, category } = req.body;

        const group = new Group({
            name,
            description,
            category
        });

        await group.save();
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete group
router.delete('/groups/:id', async (req, res) => {
    try {
        await Group.findByIdAndDelete(req.params.id);
        res.json({ message: 'Group deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all group join requests
router.get('/group-requests', async (req, res) => {
    try {
        const requests = await GroupJoinRequest.find()
            .populate('user', 'name email role')
            .populate('group', 'name')
            .sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Handle join request
router.put('/groups/:groupId/requests/:requestId', async (req, res) => {
    try {
        const { groupId, requestId } = req.params;
        const { status } = req.body;

        const request = await GroupJoinRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Join request not found' });
        }

        request.status = status;
        await request.save();

        if (status === 'approved') {
            const group = await Group.findById(groupId);
            if (!group) {
                return res.status(404).json({ message: 'Group not found' });
            }

            // Check if user is already a member
            const isMember = group.members.some(member =>
                member.user.toString() === request.user.toString()
            );

            if (!isMember) {
                group.members.push({ user: request.user });
                await group.save();
            }
        }

        res.json({ message: `Join request ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;