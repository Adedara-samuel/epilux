import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import config from '../config/environment.js';

const router = express.Router();

// Helper function to ensure image URLs are properly formatted
const transformImageUrls = (product) => {
    if (product.images && Array.isArray(product.images)) {
        // Cloudinary URLs are already full URLs, so no transformation needed
        // Just ensure altText field exists for consistency
        product.images = product.images.map(image => ({
            ...image,
            altText: image.altText || image.alt || 'Product image'
        }));
    }
    return product;
};

// Get user's cart
router.get('/', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) {
            return res.json({
                success: true,
                data: { items: [], total: 0 }
            });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart'
        });
    }
});

// Add item to cart
router.post('/items', verifyToken, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and valid quantity are required'
            });
        }

        // Check if product exists and has stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if product has at least one image
        if (!product.images || product.images.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Product must have at least one image'
            });
        }

        if (product.inventory.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.inventory.quantity} units available`
            });
        }

        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({
                userId: req.user.id,
                items: [{ productId, quantity }],
                total: product.price * quantity
            });
        } else {
            const existingItem = cart.items.find(item => item.productId.toString() === productId);

            if (existingItem) {
                if (existingItem.quantity + quantity > product.inventory.quantity) {
                    return res.status(400).json({
                        success: false,
                        message: `Cannot add ${quantity} more units. Only ${product.inventory.quantity - existingItem.quantity} available`
                    });
                }
                existingItem.quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }

            // Recalculate total
            cart.total = 0;
            for (const item of cart.items) {
                const itemProduct = await Product.findById(item.productId);
                cart.total += itemProduct.price * item.quantity;
            }
        }

        await cart.save();
        await cart.populate('items.productId');

        // Transform image URLs for all products in cart items
        if (cart.items && Array.isArray(cart.items)) {
            cart.items = cart.items.map(item => {
                if (item.productId) {
                    item.productId = transformImageUrls(item.productId);
                }
                return item;
            });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding item to cart'
        });
    }
});

// Update cart item quantity
router.put('/items/:productId', verifyToken, async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: 'Valid quantity is required'
            });
        }

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        // Check stock
        const product = await Product.findById(item.productId);
        if (product.inventory.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.inventory.quantity} units available`
            });
        }

        item.quantity = quantity;

        // Recalculate total
        cart.total = 0;
        for (const cartItem of cart.items) {
            const itemProduct = await Product.findById(cartItem.productId);
            cart.total += itemProduct.price * cartItem.quantity;
        }

        await cart.save();
        await cart.populate('items.productId');

        // Transform image URLs for all products in cart items
        if (cart.items && Array.isArray(cart.items)) {
            cart.items = cart.items.map(item => {
                if (item.productId) {
                    item.productId = transformImageUrls(item.productId);
                }
                return item;
            });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating cart item'
        });
    }
});

// Remove item from cart
router.delete('/items/:productId', verifyToken, async (req, res) => {
    try {
        const { productId } = req.params;

        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Item not found in cart'
            });
        }

        cart.items.splice(itemIndex, 1);

        // Recalculate total
        if (cart.items.length > 0) {
            cart.total = 0;
            for (const item of cart.items) {
                const product = await Product.findById(item.productId);
                cart.total += product.price * item.quantity;
            }
        } else {
            cart.total = 0;
        }

        await cart.save();
        await cart.populate('items.productId');

        // Transform image URLs for all products in cart items
        if (cart.items && Array.isArray(cart.items)) {
            cart.items = cart.items.map(item => {
                if (item.productId) {
                    item.productId = transformImageUrls(item.productId);
                }
                return item;
            });
        }

        res.json({
            success: true,
            data: cart
        });
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing item from cart'
        });
    }
});

// Clear cart
router.delete('/', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({ userId: req.user.id });

        res.json({
            success: true,
            message: 'Cart cleared successfully'
        });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing cart'
        });
    }
});

export default router;