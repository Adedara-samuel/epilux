import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const commissionRateSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    rate: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        default: 'percentage'
    },
    category: {
        type: String,
        enum: ['product', 'service', 'referral', 'general'],
        default: 'general'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on update
commissionRateSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Index for better performance
commissionRateSchema.index({ isActive: 1, category: 1 });
commissionRateSchema.index({ createdAt: -1 });

export default model('CommissionRate', commissionRateSchema);