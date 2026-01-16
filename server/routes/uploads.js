import express from 'express';
import upload from '../middleware/upload.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { catchAsync } from '../middleware/errorHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import config from '../config/environment.js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET
});

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

    try {
        // Upload each file to Cloudinary
        const uploadPromises = req.files.map(async (file) => {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'epilux/products',
                        public_id: `product_${Date.now()}_${Math.random().toString(36).substring(2)}`,
                        transformation: [
                            { width: 800, height: 800, crop: 'limit' },
                            { quality: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve({
                                url: result.secure_url,
                                publicId: result.public_id,
                                altText: file.originalname,
                                isPrimary: false
                            });
                        }
                    }
                );

                uploadStream.end(file.buffer);
            });
        });

        const uploadedImages = await Promise.all(uploadPromises);

        // Set first image as primary if no primary is set
        if (uploadedImages.length > 0) {
            uploadedImages[0].isPrimary = true;
        }

        res.json({
            success: true,
            message: `${req.files.length} file(s) uploaded successfully`,
            images: uploadedImages
        });
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload images'
        });
    }
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