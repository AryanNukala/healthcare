import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Availability from '../models/Availability.js';

const router = express.Router();

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available doctors and their time slots
router.get('/available-doctors', async (req, res) => {
  try {
    // Find all approved doctors
    const doctors = await User.find({
      role: 'doctor',
      'profile.isApproved': true
    }).select('name email profile');

    // If date is provided, get availabilities for that date
    if (req.query.date) {
      const availabilities = await Availability.find({
        date: new Date(req.query.date),
        doctor: { $in: doctors.map(d => d._id) }
      }).populate('doctor', 'name email profile');

      res.json(availabilities);
    } else {
      // If no date provided, just return the doctors
      res.json(doctors.map(doctor => ({
        doctor,
        timeSlots: []
      })));
    }
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: error.message });
  }
});

// Request appointment
router.post('/appointments', async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    // Validate input
    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find the availability
    const availability = await Availability.findOne({
      doctor: doctorId,
      date: new Date(date),
      'timeSlots.time': time,
      'timeSlots.isBooked': false
    });

    if (!availability) {
      return res.status(400).json({ message: 'Selected time slot is not available' });
    }

    // Create appointment
    const appointment = new Appointment({
      patient: req.user.userId,
      doctor: doctorId,
      date: new Date(date),
      time,
      reason,
      status: 'pending'
    });

    // Update availability time slot
    await Availability.updateOne(
      {
        _id: availability._id,
        'timeSlots.time': time
      },
      {
        $set: {
          'timeSlots.$.isBooked': true
        }
      }
    );

    await appointment.save();

    // Populate doctor details in the response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('doctor', 'name email profile')
      .populate('patient', 'name email');

    res.status(201).json(populatedAppointment);
  } catch (error) {
    console.error('Appointment creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's appointments
router.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.userId })
      .populate('doctor', 'name email profile')
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;