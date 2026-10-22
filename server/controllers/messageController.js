import Message from '../models/Message.js';
import User from '../models/User.js';

// List messages for the authenticated user
export const getMessages = async (req, res) => {
    try {
        const { page = 1, limit = 10, isRead } = req.query;
        const skip = (page - 1) * limit;

        const query = { recipient: req.user._id };
        if (isRead !== undefined) {
            query.isRead = isRead === 'true';
        }

        const messages = await Message.find(query)
            .populate('sender', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Message.countDocuments(query);

        res.json({
            success: true,
            messages,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
};

// Send a new message
export const sendMessage = async (req, res) => {
    try {
        const { recipient, subject, message, priority, category } = req.body;

        // Verify recipient exists
        const recipientUser = await User.findById(recipient);
        if (!recipientUser) {
            return res.status(404).json({
                success: false,
                message: 'Recipient not found'
            });
        }

        const newMessage = new Message({
            sender: req.user._id,
            recipient,
            subject,
            message,
            priority: priority || 'medium',
            category: category || 'general'
        });

        await newMessage.save();
        await newMessage.populate('sender', 'firstName lastName email');
        await newMessage.populate('recipient', 'firstName lastName email');

        res.status(201).json({
            success: true,
            message: newMessage
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message',
            error: error.message
        });
    }
};

// Get a specific message
export const getMessage = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id)
            .populate('sender', 'firstName lastName email')
            .populate('recipient', 'firstName lastName email');

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Check if user has permission to view this message
        if (message.sender.toString() !== req.user._id.toString() &&
            message.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this message'
            });
        }

        res.json({
            success: true,
            message
        });
    } catch (error) {
        console.error('Error fetching message:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch message',
            error: error.message
        });
    }
};

// Mark message as read
export const markMessageAsRead = async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found'
            });
        }

        // Only recipient can mark as read
        if (message.recipient.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to mark this message as read'
            });
        }

        if (!message.isRead) {
            message.isRead = true;
            await message.save();
        }

        res.json({
            success: true,
            message: 'Message marked as read'
        });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to mark message as read',
            error: error.message
        });
    }
};