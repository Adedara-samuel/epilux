import express from 'express';
import { authenticate as protect } from '../middleware/auth.js';
import {
    trackPackage,
    deliveryWebhook,
    getDeliveryRates,
    estimateDeliveryCost
} from '../controllers/deliveryController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Track package by tracking number
router.get('/tracking/:trackingNumber', trackPackage);

// Webhook for delivery providers (no auth required for webhooks)
router.post('/webhook', deliveryWebhook);

// Get available delivery rates
router.get('/rates', getDeliveryRates);

// Estimate delivery cost
router.post('/estimate', estimateDeliveryCost);

export default router;