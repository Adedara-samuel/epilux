import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import AffiliateWithdrawal from '../models/AffiliateWithdrawal.js';
import emailService from '../services/emailServiceNew.js';

// Get wallet balance for user
export const getWalletBalance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user to check role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For affiliates, calculate balance from commissions
    if (user.role === 'affiliate') {
      // Get total commissions earned
      const totalEarned = await Transaction.aggregate([
        { $match: { userId: userId, type: 'credit' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      // Get total withdrawn
      const totalWithdrawn = await AffiliateWithdrawal.aggregate([
        { $match: { affiliateId: userId, status: { $in: ['approved', 'processed'] } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const availableBalance = (totalEarned[0]?.total || 0) - (totalWithdrawn[0]?.total || 0);

      return res.json({
        availableBalance: Math.max(0, availableBalance),
        totalEarned: totalEarned[0]?.total || 0,
        totalWithdrawn: totalWithdrawn[0]?.total || 0
      });
    }

    // For regular users, return zero balance (they don't earn commissions)
    return res.json({
      availableBalance: 0,
      totalEarned: 0,
      totalWithdrawn: 0
    });

  } catch (error) {
    console.error('Error getting wallet balance:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get wallet transactions for user
export const getWalletTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get transactions for the user
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('type amount description status createdAt');

    const total = await Transaction.countDocuments({ userId });

    res.json({
      transactions: transactions.map(tx => ({
        id: tx._id,
        type: tx.type,
        amount: tx.amount,
        description: tx.description,
        date: tx.createdAt,
        status: tx.status
      })),
      total,
      page,
      pages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Error getting wallet transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Request withdrawal
export const requestWithdrawal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, bankName, accountNumber, accountName } = req.body;

    // Validate input
    if (!amount || !bankName || !accountNumber || !accountName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be greater than 0' });
    }

    // Get user
    const user = await User.findById(userId);
    if (!user || user.role !== 'affiliate') {
      return res.status(403).json({ error: 'Only affiliates can request withdrawals' });
    }

    // Check available balance
    const totalEarned = await Transaction.aggregate([
      { $match: { userId: userId, type: 'credit' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalWithdrawn = await AffiliateWithdrawal.aggregate([
      { $match: { affiliateId: userId, status: { $in: ['approved', 'processed'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const availableBalance = (totalEarned[0]?.total || 0) - (totalWithdrawn[0]?.total || 0);

    if (amount > availableBalance) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Create withdrawal request
    const withdrawal = new AffiliateWithdrawal({
      affiliateId: userId,
      amount,
      bankName,
      accountNumber,
      accountName,
      status: 'pending',
      requestedAt: new Date()
    });

    await withdrawal.save();

    // Send email notification to admin
    try {
      await emailService.sendEmail(
        process.env.ADMIN_EMAIL || 'admin@epilux.com',
        'New Withdrawal Request',
        'affiliate-withdrawal-request',
        {
          affiliateName: user.name,
          affiliateEmail: user.email,
          amount: amount.toLocaleString(),
          bankName,
          accountNumber,
          accountName,
          withdrawalId: withdrawal._id
        }
      );
    } catch (emailError) {
      console.error('Error sending withdrawal notification email:', emailError);
    }

    res.json({
      message: 'Withdrawal request submitted successfully',
      withdrawal: {
        id: withdrawal._id,
        amount: withdrawal.amount,
        bankName: withdrawal.bankName,
        accountNumber: withdrawal.accountNumber,
        accountName: withdrawal.accountName,
        status: withdrawal.status,
        requestedAt: withdrawal.requestedAt
      }
    });

  } catch (error) {
    console.error('Error requesting withdrawal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get pending withdrawals (Admin only)
export const getPendingWithdrawals = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const withdrawals = await AffiliateWithdrawal.find({ status: 'pending' })
      .populate('affiliateId', 'name email')
      .sort({ requestedAt: -1 });

    res.json({
      withdrawals: withdrawals.map(w => ({
        id: w._id,
        affiliateId: w.affiliateId._id,
        affiliateName: w.affiliateId.name,
        affiliateEmail: w.affiliateId.email,
        amount: w.amount,
        bankName: w.bankName,
        accountNumber: w.accountNumber,
        accountName: w.accountName,
        status: w.status,
        requestedAt: w.requestedAt
      })),
      total: withdrawals.length
    });

  } catch (error) {
    console.error('Error getting pending withdrawals:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Process withdrawal (Admin only)
export const processWithdrawal = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { id } = req.params;
    const { action, adminNote } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const withdrawal = await AffiliateWithdrawal.findById(id).populate('affiliateId', 'name email');
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    if (withdrawal.status !== 'pending') {
      return res.status(400).json({ error: 'Withdrawal already processed' });
    }

    withdrawal.status = action === 'approve' ? 'approved' : 'rejected';
    withdrawal.processedAt = new Date();
    withdrawal.adminNote = adminNote;

    await withdrawal.save();

    // Send email to affiliate
    try {
      await emailService.sendEmail(
        withdrawal.affiliateId.email,
        `Withdrawal ${action === 'approve' ? 'Approved' : 'Rejected'}`,
        'affiliate-withdrawal-result',
        {
          affiliateName: withdrawal.affiliateId.name,
          amount: withdrawal.amount.toLocaleString(),
          action: action === 'approve' ? 'approved' : 'rejected',
          adminNote: adminNote || 'No additional notes'
        }
      );
    } catch (emailError) {
      console.error('Error sending withdrawal result email:', emailError);
    }

    res.json({
      message: `Withdrawal ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      withdrawal: {
        id: withdrawal._id,
        status: withdrawal.status,
        processedAt: withdrawal.processedAt,
        adminNote: withdrawal.adminNote
      }
    });

  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};