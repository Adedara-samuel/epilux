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

export default router;