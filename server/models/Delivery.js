import mongoose from 'mongoose';

const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    trackingNumber: {
        type: String,
        required: true,
        unique: true
    },
    carrier: {
        type: String,
        required: true,
        enum: ['dhl', 'fedex', 'ups', 'usps', 'local_courier', 'other']
    },
    status: {
        type: String,
        enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'],
        default: 'pending'
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        location: String,
        description: String
    }],
    estimatedDelivery: {
        type: Date
    },
    actualDelivery: {
        type: Date
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    weight: {
        type: Number,
        min: 0
    },
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    cost: {
        type: Number,
        min: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    notes: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
deliverySchema.index({ trackingNumber: 1 });
deliverySchema.index({ order: 1 });
deliverySchema.index({ status: 1 });
deliverySchema.index({ carrier: 1 });

// Virtual for delivery URL
deliverySchema.virtual('url').get(function() {
    return `/delivery/tracking/${this.trackingNumber}`;
});

// Pre-save hook to update status history
deliverySchema.pre('save', function(next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
            description: `Status updated to ${this.status}`
        });

        if (this.status === 'delivered' && !this.actualDelivery) {
            this.actualDelivery = new Date();
        }
    }
    next();
});

const Delivery = mongoose.model('Delivery', deliverySchema);

export default Delivery;