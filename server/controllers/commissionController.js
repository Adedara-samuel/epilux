import CommissionRate from '../models/CommissionRate.js';

// Get all commission rates
const getCommissionRates = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

        const commissionRates = await CommissionRate.find(filter)
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await CommissionRate.countDocuments(filter);

        res.json({
            success: true,
            commissionRates,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching commission rates:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching commission rates'
        });
    }
};

// Get single commission rate
const getCommissionRate = async (req, res) => {
    try {
        const commissionRate = await CommissionRate.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email');

        if (!commissionRate) {
            return res.status(404).json({
                success: false,
                message: 'Commission rate not found'
            });
        }

        res.json({
            success: true,
            commissionRate
        });
    } catch (error) {
        console.error('Error fetching commission rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching commission rate'
        });
    }
};

// Create commission rate
const createCommissionRate = async (req, res) => {
    try {
        const { name, description, rate, type, category } = req.body;

        const commissionRate = new CommissionRate({
            name,
            description,
            rate,
            type: type || 'percentage',
            category: category || 'general',
            createdBy: req.user._id
        });

        await commissionRate.save();

        res.status(201).json({
            success: true,
            message: 'Commission rate created successfully',
            commissionRate
        });
    } catch (error) {
        console.error('Error creating commission rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating commission rate'
        });
    }
};

// Update commission rate
const updateCommissionRate = async (req, res) => {
    try {
        const { name, description, rate, type, category, isActive } = req.body;

        const commissionRate = await CommissionRate.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                rate,
                type,
                category,
                isActive,
                updatedAt: Date.now()
            },
            { new: true, runValidators: true }
        );

        if (!commissionRate) {
            return res.status(404).json({
                success: false,
                message: 'Commission rate not found'
            });
        }

        res.json({
            success: true,
            message: 'Commission rate updated successfully',
            commissionRate
        });
    } catch (error) {
        console.error('Error updating commission rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating commission rate'
        });
    }
};

// Toggle commission rate status (enable/disable)
const toggleCommissionRateStatus = async (req, res) => {
    try {
        const commissionRate = await CommissionRate.findById(req.params.id);

        if (!commissionRate) {
            return res.status(404).json({
                success: false,
                message: 'Commission rate not found'
            });
        }

        commissionRate.isActive = !commissionRate.isActive;
        await commissionRate.save();

        res.json({
            success: true,
            message: `Commission rate ${commissionRate.isActive ? 'enabled' : 'disabled'} successfully`,
            commissionRate
        });
    } catch (error) {
        console.error('Error toggling commission rate status:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling commission rate status'
        });
    }
};

// Delete commission rate
const deleteCommissionRate = async (req, res) => {
    try {
        const commissionRate = await CommissionRate.findByIdAndDelete(req.params.id);

        if (!commissionRate) {
            return res.status(404).json({
                success: false,
                message: 'Commission rate not found'
            });
        }

        res.json({
            success: true,
            message: 'Commission rate deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting commission rate:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting commission rate'
        });
    }
};

// Get active commission rates by category
const getActiveCommissionRates = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = { isActive: true };
        if (category) filter.category = category;

        const commissionRates = await CommissionRate.find(filter)
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            commissionRates
        });
    } catch (error) {
        console.error('Error fetching active commission rates:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching active commission rates'
        });
    }
};

export {
    getCommissionRates,
    getCommissionRate,
    createCommissionRate,
    updateCommissionRate,
    toggleCommissionRateStatus,
    deleteCommissionRate,
    getActiveCommissionRates
};