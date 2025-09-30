const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');
const User = require('../models/User');

// Get all users (admin only)
router.get('/users', authenticate, authorize('admin'), async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        
        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users'
        });
    }
});

// Get user by ID (admin only)
router.get('/users/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user'
        });
    }
});

// Update user role (admin only)
router.put('/users/:id/role', authenticate, authorize('admin'), async (req, res) => {
    try {
        const { role } = req.body;
        
        if (!['user', 'admin', 'affiliate'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User role updated successfully',
            user
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role'
        });
    }
});

// Delete user (admin only)
router.delete('/users/:id', authenticate, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
});

// Get admin dashboard stats (admin only)
router.get('/dashboard/stats', authenticate, authorize('admin'), async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const adminUsers = await User.countDocuments({ role: 'admin' });
        const affiliateUsers = await User.countDocuments({ role: 'affiliate' });
        const regularUsers = await User.countDocuments({ role: 'user' });

        const stats = {
            totalUsers,
            adminUsers,
            affiliateUsers,
            regularUsers
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats'
        });
    }
});

// Get recent users (admin only)
router.get('/users/recent', authenticate, authorize('admin'), async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const recentUsers = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json({
            success: true,
            users: recentUsers
        });
    } catch (error) {
        console.error('Error fetching recent users:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching recent users'
        });
    }
});

module.exports = router;
