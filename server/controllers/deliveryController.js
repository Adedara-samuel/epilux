import Delivery from '../models/Delivery.js';
import Order from '../models/Order.js';

// Track package by tracking number
export const trackPackage = async (req, res) => {
    try {
        const { trackingNumber } = req.params;

        const delivery = await Delivery.findOne({ trackingNumber })
            .populate('order', 'orderNumber total status createdAt')
            .sort({ 'statusHistory.timestamp': -1 });

        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: 'Package not found'
            });
        }

        // Check if user has permission to view this delivery
        // Users can only view their own deliveries
        if (req.user.role !== 'admin' && delivery.order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this delivery'
            });
        }

        res.json({
            success: true,
            delivery
        });
    } catch (error) {
        console.error('Error tracking package:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to track package',
            error: error.message
        });
    }
};

// Webhook for delivery providers to send updates
export const deliveryWebhook = async (req, res) => {
    try {
        const { trackingNumber, status, location, description, carrier } = req.body;

        const delivery = await Delivery.findOne({ trackingNumber });
        if (!delivery) {
            return res.status(404).json({
                success: false,
                message: 'Delivery not found'
            });
        }

        // Update delivery status
        delivery.status = status;
        if (location) {
            delivery.statusHistory[delivery.statusHistory.length - 1].location = location;
        }
        if (description) {
            delivery.statusHistory[delivery.statusHistory.length - 1].description = description;
        }

        await delivery.save();

        res.json({
            success: true,
            message: 'Delivery status updated successfully'
        });
    } catch (error) {
        console.error('Error processing delivery webhook:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process delivery update',
            error: error.message
        });
    }
};

// Get available delivery rates
export const getDeliveryRates = async (req, res) => {
    try {
        // This would typically integrate with shipping providers
        // For now, return mock rates
        const rates = [
            {
                carrier: 'dhl',
                service: 'Standard',
                cost: 15.99,
                currency: 'USD',
                estimatedDays: 3
            },
            {
                carrier: 'fedex',
                service: 'Express',
                cost: 25.99,
                currency: 'USD',
                estimatedDays: 1
            },
            {
                carrier: 'ups',
                service: 'Ground',
                cost: 12.99,
                currency: 'USD',
                estimatedDays: 5
            },
            {
                carrier: 'local_courier',
                service: 'Same Day',
                cost: 8.99,
                currency: 'USD',
                estimatedDays: 1
            }
        ];

        res.json({
            success: true,
            rates
        });
    } catch (error) {
        console.error('Error fetching delivery rates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch delivery rates',
            error: error.message
        });
    }
};

// Estimate delivery cost
export const estimateDeliveryCost = async (req, res) => {
    try {
        const { weight, dimensions, destination, carrier } = req.body;

        // Simple estimation logic - in production, this would use carrier APIs
        let baseCost = 10;
        if (weight > 5) baseCost += (weight - 5) * 2;
        if (dimensions && dimensions.length > 20) baseCost += 5;

        // Add carrier-specific pricing
        const carrierMultipliers = {
            dhl: 1.2,
            fedex: 1.5,
            ups: 1.1,
            local_courier: 0.8
        };

        const multiplier = carrierMultipliers[carrier] || 1;
        const estimatedCost = baseCost * multiplier;

        res.json({
            success: true,
            estimate: {
                cost: Math.round(estimatedCost * 100) / 100,
                currency: 'USD',
                carrier,
                estimatedDays: carrier === 'fedex' ? 1 : carrier === 'local_courier' ? 1 : 3
            }
        });
    } catch (error) {
        console.error('Error estimating delivery cost:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to estimate delivery cost',
            error: error.message
        });
    }
};