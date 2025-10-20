import express from 'express';
import { AuthRequest, authenticate, authorize } from '../middleware/auth';
import User from '../models/User';
import Transaction from '../models/Transaction';

const router = express.Router();

// GET /api/users/:id - Get user by ID (admin only)
router.get('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/:id/transactions - Get user's transactions (nested route)
router.get('/:id/transactions', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.params.id;
    
    // Check if user is requesting their own transactions or is admin
    if (userId !== req.user!.userId && req.user!.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const transactions = await Transaction.find({ userId })
      .populate('escrowId', 'title description')
      .sort({ createdAt: -1 });

    res.json({ transactions });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;