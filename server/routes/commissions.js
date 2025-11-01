import express from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
    getCommissionRates,
    getCommissionRate,
    createCommissionRate,
    updateCommissionRate,
    toggleCommissionRateStatus,
    deleteCommissionRate,
    getActiveCommissionRates
} from '../controllers/commissionController.js';
import AffiliateCommission from '../models/AffiliateCommission.js';
import {
    validateCommissionRateCreation,
    validateCommissionRateUpdate,
    validateMongoId,
    validatePagination,
    handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

// Get all commission rates
router.get('/', validatePagination, handleValidationErrors, getCommissionRates);

// Get active commission rates (for public use)
router.get('/active', getActiveCommissionRates);

// Get single commission rate
router.get('/:id', validateMongoId, getCommissionRate);

// Create commission rate
router.post('/', validateCommissionRateCreation, handleValidationErrors, createCommissionRate);

// Update commission rate
router.put('/:id', validateMongoId, validateCommissionRateUpdate, handleValidationErrors, updateCommissionRate);

// Toggle commission rate status (enable/disable)
router.patch('/:id/toggle-status', validateMongoId, toggleCommissionRateStatus);

// Delete commission rate
router.delete('/:id', validateMongoId, deleteCommissionRate);

// Controller functions for commission management
const getUserCommissions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = { affiliate: req.user._id };
        if (req.query.status) query.status = req.query.status;

        const commissions = await AffiliateCommission.find(query)
            .populate('referredUser', 'firstName lastName email')
            .populate('order', 'orderNumber total')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await AffiliateCommission.countDocuments(query);

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
        console.error('Error fetching user commissions:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching commissions'
        });
    }
};

const getCommissionDetails = async (req, res) => {
    try {
        const commission = await AffiliateCommission.findById(req.params.id)
            .populate('affiliate', 'firstName lastName email')
            .populate('referredUser', 'firstName lastName email')
            .populate('order', 'orderNumber total items');

        if (!commission) {
            return res.status(404).json({
                success: false,
                message: 'Commission not found'
            });
        }

        // Check if user has permission to view this commission
        if (req.user.role !== 'admin' && commission.affiliate.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this commission'
            });
        }

        res.json({
            success: true,
            commission
        });
    } catch (error) {
        console.error('Error fetching commission details:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching commission details'
        });
    }
};

const updateCommissionStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const commission = await AffiliateCommission.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!commission) {
            return res.status(404).json({
                success: false,
                message: 'Commission not found'
            });
        }

        res.json({
            success: true,
            message: 'Commission status updated successfully',
            commission
        });
    } catch (error) {
        console.error('Error updating commission status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating commission status'
        });
    }
};

const calculateCommission = async (req, res) => {
    try {
        const { orderAmount, commissionRate } = req.body;

        if (!orderAmount || orderAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Valid order amount is required'
            });
        }

        const rate = commissionRate || 0.12; // Default 12%
        const commission = orderAmount * rate;

        res.json({
            success: true,
            calculation: {
                orderAmount,
                commissionRate: rate,
                commissionAmount: Math.round(commission * 100) / 100
            }
        });
    } catch (error) {
        console.error('Error calculating commission:', error);
        res.status(500).json({
            success: false,
            message: 'Error calculating commission'
        });
    }
};

// User-specific commission endpoints (no admin auth required)
const userRouter = express.Router();
userRouter.use(authenticate);

// Get user's commissions
userRouter.get('/me', getUserCommissions);

// Get commission details
userRouter.get('/:id', getCommissionDetails);

// Calculate commission estimate
userRouter.post('/calculate', calculateCommission);

// Admin endpoints for managing individual commissions
userRouter.put('/:id/status', authorize('admin'), updateCommissionStatus);

// Mount user routes without admin requirement
router.use('/', userRouter);

export default router;
