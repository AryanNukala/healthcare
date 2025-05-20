import express from 'express';
import { checkRole, checkGroupModeration, checkArticlePermissions } from '../middleware/rbac.js';
import Group from '../models/Group.js';
import Article from '../models/Article.js';
import Appointment from '../models/Appointment.js';
import Availability from '../models/Availability.js';

const router = express.Router();

// Get all availabilities (accessible by both doctors and patients)
router.get('/availability', async (req, res) => {
    try {
        const query = req.user.role === 'doctor'
            ? { doctor: req.user.userId }
            : { date: { $gte: new Date() } };

        const availability = await Availability.find(query)
            .populate('doctor', 'name email profile')
            .sort({ date: 1 });

        res.json(availability);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add availability (doctors only)
router.post('/availability', checkRole(['doctor']), async (req, res) => {
    try {
        const { date, timeSlots } = req.body;

        const availability = new Availability({
            doctor: req.user.userId,
            date,
            timeSlots
        });

        await availability.save();
        res.status(201).json(availability);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: 'Availability already exists for this date' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Delete availability
router.delete('/availability/:id', checkRole(['doctor']), async (req, res) => {
    try {
        await Availability.findOneAndDelete({
            _id: req.params.id,
            doctor: req.user.userId
        });
        res.json({ message: 'Availability deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get doctor's appointments
router.get('/appointments', checkRole(['doctor']), async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctor: req.user.userId })
            .populate('patient', 'name email')
            .sort({ createdAt: -1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update appointment status
router.put('/appointments/:appointmentId', checkRole(['doctor']), async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status, notes } = req.body;

        const appointment = await Appointment.findOneAndUpdate(
            { _id: appointmentId, doctor: req.user.userId },
            { status, notes },
            { new: true }
        ).populate('patient', 'name email');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;