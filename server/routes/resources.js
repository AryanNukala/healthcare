import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Resource from '../models/Resource.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Configure multer for PDF uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/resources';
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

// Get all resources
router.get('/', verifyToken, async (req, res) => {
    try {
        const resources = await Resource.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });
        res.json(resources);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Upload new resource (doctors only)
router.post('/', verifyToken, upload.single('pdf'), async (req, res) => {
    try {
        if (req.user.role !== 'doctor' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only doctors can upload resources' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded' });
        }

        const resource = new Resource({
            title: req.body.title,
            fileName: req.file.filename,
            fileSize: req.file.size,
            category: req.body.category,
            author: req.user.userId
        });

        await resource.save();
        res.status(201).json(resource);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Download resource
router.get('/download/:id', verifyToken, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const filePath = path.join('uploads/resources', resource.fileName);
        res.download(filePath, resource.title + '.pdf');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete resource (doctors can only delete their own resources)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        if (req.user.role !== 'admin' && resource.author.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this resource' });
        }

        const filePath = path.join('uploads/resources', resource.fileName);
        fs.unlinkSync(filePath);
        await resource.deleteOne();

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;