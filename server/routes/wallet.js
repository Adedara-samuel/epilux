import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getWalletBalance,
  getWalletTransactions,
  requestWithdrawal,
  getPendingWithdrawals,
  processWithdrawal
} from '../controllers/walletController.js';

const router = express.Router();

// User wallet routes
router.get('/balance', authenticate, getWalletBalance);
router.get('/transactions', authenticate, getWalletTransactions);
router.post('/withdraw', authenticate, requestWithdrawal);

// Admin wallet routes
router.get('/admin/withdrawals/pending', authenticate, getPendingWithdrawals);
router.post('/admin/wallet/withdraw/:id/process', authenticate, processWithdrawal);

export default router;