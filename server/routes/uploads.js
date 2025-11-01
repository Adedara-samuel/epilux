import express from 'express';
import upload from '../middleware/upload.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { catchAsync } from '../middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Upload multiple images
router.post('/multiple', authenticate, authorize('admin'), upload.array('images', 10), catchAsync(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No files uploaded'
        });
    }

    const uploadedImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: file.originalname,
        isPrimary: false
    }));

    // Set first image as primary if no primary is set
    if (uploadedImages.length > 0) {
        uploadedImages[0].isPrimary = true;
    }

    res.json({
        success: true,
        message: `${req.files.length} file(s) uploaded successfully`,
        images: uploadedImages
    });
}));

// Delete image
router.delete('/:filename', authenticate, authorize('admin'), catchAsync(async (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../uploads/', filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({
            success: false,
            message: 'File not found'
        });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    res.json({
        success: true,
        message: 'File deleted successfully'
    });
}));

export default router;