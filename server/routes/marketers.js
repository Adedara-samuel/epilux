import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import AffiliateCommission from '../models/AffiliateCommission.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// List marketers (admin only)
router.get('/', authorize('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const marketers = await User.find({ role: 'marketer' })
            .select('firstName lastName email phone createdAt isActive')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await User.countDocuments({ role: 'marketer' });

        res.json({
            success: true,
            marketers,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching marketers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching marketers'
        });
    }
});

// Get marketer details (admin only)
router.get('/:id', authorize('admin'), async (req, res) => {
    try {
        const marketer = await User.findOne({ _id: req.params.id, role: 'marketer' })
            .select('-password');

        if (!marketer) {
            return res.status(404).json({
                success: false,
                message: 'Marketer not found'
            });
        }

        // Get marketer's stats
        const ordersCount = await Order.countDocuments({ user: req.params.id });
        const commissions = await AffiliateCommission.find({ affiliate: req.params.id });
        const totalEarned = commissions
            .filter(c => ['approved', 'paid'].includes(c.status))
            .reduce((sum, c) => sum + c.amount, 0);

        res.json({
            success: true,
            marketer: {
                ...marketer.toObject(),
                stats: {
                    ordersCount,
                    commissionsCount: commissions.length,
                    totalEarned
                }
            }
        });
    } catch (error) {
        console.error('Error fetching marketer details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching marketer details'
        });
    }
});

// Create marketer (admin only)
router.post('/', authorize('admin'), async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const marketer = new User({
            firstName,
            lastName,
            email,
            phone,
            password,
            role: 'marketer'
        });

        await marketer.save();

        res.status(201).json({
            success: true,
            message: 'Marketer created successfully',
            marketer: {
                _id: marketer._id,
                firstName: marketer.firstName,
                lastName: marketer.lastName,
                email: marketer.email,
                role: marketer.role,
                createdAt: marketer.createdAt
            }
        });
    } catch (error) {
        console.error('Error creating marketer:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating marketer'
        });
    }
});

// Update marketer (admin only)
router.put('/:id', authorize('admin'), async (req, res) => {
    try {
        const { firstName, lastName, email, phone, isActive } = req.body;

        const marketer = await User.findOneAndUpdate(
            { _id: req.params.id, role: 'marketer' },
            { firstName, lastName, email, phone, isActive },
            { new: true, runValidators: true }
        ).select('-password');

        if (!marketer) {
            return res.status(404).json({
                success: false,
                message: 'Marketer not found'
            });
        }

        res.json({
            success: true,
            message: 'Marketer updated successfully',
            marketer
        });
    } catch (error) {
        console.error('Error updating marketer:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating marketer'
        });
    }
});

// Delete marketer (admin only)
router.delete('/:id', authorize('admin'), async (req, res) => {
    try {
        const marketer = await User.findOneAndDelete({ _id: req.params.id, role: 'marketer' });

        if (!marketer) {
            return res.status(404).json({
                success: false,
                message: 'Marketer not found'
            });
        }

        res.json({
            success: true,
            message: 'Marketer deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting marketer:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting marketer'
        });
    }
});

// Get marketer's orders (admin only)
router.get('/:id/orders', authorize('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ user: req.params.id })
            .populate('items.product', 'name price')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Order.countDocuments({ user: req.params.id });

        res.json({
            success: true,
            orders,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching marketer orders:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching marketer orders'
        });
    }
});

// Get marketer's commissions (admin only)
router.get('/:id/commissions', authorize('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const commissions = await AffiliateCommission.find({ affiliate: req.params.id })
            .populate('referredUser', 'firstName lastName email')
            .populate('order', 'orderNumber total')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AffiliateCommission.countDocuments({ affiliate: req.params.id });

        res.json({
            success: true,
            commissions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching marketer commissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching marketer commissions'
        });
    }
});

export default router;