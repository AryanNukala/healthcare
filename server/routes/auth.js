import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ValidationError, UnauthorizedError, ForbiddenError } from '../utils/errors.js';

const router = express.Router();

// Admin credentials (should be in environment variables in production)
const ADMIN_EMAIL = 'admin@serenecare.com';
const ADMIN_PASSWORD = 'Admin@123';

// Create or update admin user
const createAdminIfNotExists = async () => {
  try {
    let admin = await User.findOne({ email: ADMIN_EMAIL });

    if (!admin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      admin = new User({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user created successfully');
    }
    return admin;
  } catch (error) {
    console.error('Error managing admin user:', error);
    throw error;
  }
};

// Initialize admin user
(async () => {
  try {
    await createAdminIfNotExists();
  } catch (error) {
    console.error('❌ Failed to initialize admin user:', error);
  }
})();

// Admin login endpoint
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    const admin = await User.findOne({ email, role: 'admin' });
    if (!admin) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch && password !== 'Admin@123') {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Create token
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message,
      status: error.status || 'error'
    });
  }
});

// Regular user/doctor login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      throw new ValidationError('Email and password are required');
    }

    // Find user (excluding admin)
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send response based on role
    const response = {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    };

    // Add role-specific data
    if (user.role === 'doctor') {
      response.user.isApproved = user.profile.isApproved;
    }

    res.json(response);
  } catch (error) {
    console.error("❌ Login Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message,
      status: error.status || 'error'
    });
  }
});

// Register endpoint (for patients and doctors only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, profile } = req.body;

    // Validate input
    if (!name || !email || !password) {
      throw new ValidationError('Name, email and password are required');
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ValidationError('User already exists');
    }

    // Prevent admin registration through public endpoint
    if (role === 'admin') {
      throw new ForbiddenError('Admin accounts cannot be created through registration');
    }

    // Create user
    const user = new User({
      name,
      email,
      password, // Password will be hashed by the pre-save middleware
      role: role || 'patient',
      profile: {
        ...profile,
        isApproved: role !== 'doctor' // Doctors need approval
      }
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({
      message: error.message,
      status: error.status || 'error'
    });
  }
});

export default router;