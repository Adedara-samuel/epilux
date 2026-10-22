import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const AffiliateWithdrawalSchema = new Schema({
    affiliateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    bankName: {
        type: String,
        required: true
    },
    accountNumber: {
        type: String,
        required: true
    },
    accountName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'processed'],
        default: 'pending'
    },
    requestedAt: {
        type: Date,
        default: Date.now
    },
    processedAt: {
        type: Date
    },
    adminNote: {
        type: String,
        trim: true
    },
    transactionReference: {
        type: String,
        trim: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
AffiliateWithdrawalSchema.index({ affiliateId: 1, status: 1 });
AffiliateWithdrawalSchema.index({ status: 1 });
AffiliateWithdrawalSchema.index({ requestedAt: -1 });

// Pre-save hook to round amount to 2 decimal places
AffiliateWithdrawalSchema.pre('save', function(next) {
    if (this.isModified('amount')) {
        this.amount = Math.round(this.amount * 100) / 100;
    }
    next();
});

// Static method to get total withdrawn by affiliate
AffiliateWithdrawalSchema.statics.getTotalWithdrawn = async function(affiliateId) {
    const result = await this.aggregate([
        {
            $match: {
                affiliateId: affiliateId,
                status: { $in: ['approved', 'processed'] }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);

    return result.length > 0 ? result[0].total : 0;
};

// Static method to get pending withdrawals
AffiliateWithdrawalSchema.statics.getPendingWithdrawals = async function() {
    return this.find({ status: 'pending' })
        .populate('affiliateId', 'name email')
        .sort({ requestedAt: 1 });
};

// Virtual for formatted amount
AffiliateWithdrawalSchema.virtual('formattedAmount').get(function() {
    return `$${this.amount.toFixed(2)}`;
});

// Virtual for status badge class
AffiliateWithdrawalSchema.virtual('statusBadgeClass').get(function() {
    const statusClasses = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        rejected: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800'
    };
    return statusClasses[this.status] || 'bg-gray-100 text-gray-800';
});

// Virtual for formatted date
AffiliateWithdrawalSchema.virtual('formattedDate').get(function() {
    return this.requestedAt.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
});

export default model('AffiliateWithdrawal', AffiliateWithdrawalSchema);
