import { Request, Response } from 'express';
import EscrowMetadata from '../models/EscrowMetadata';
import { AuthRequest } from '../middleware/auth';

export const createEscrowMetadata = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { contractEscrowId, title, description, category, buyerAddress, sellerAddress, arbiterAddress } = req.body;
    const userId = req.user!.userId;

    const escrow = await EscrowMetadata.create({
      contractEscrowId,
      userId,
      title,
      description,
      category,
      buyerAddress,
      sellerAddress,
      arbiterAddress,
      status: 'active'
    });

    res.status(201).json({
      message: 'Escrow metadata created',
      escrow
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllEscrows = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, category, status } = req.query;
    
    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const escrows = await EscrowMetadata.find(filter)
      .populate('userId', 'name email')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    const total = await EscrowMetadata.countDocuments(filter);

    res.json({
      escrows,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getEscrowById = async (req: Request, res: Response): Promise<void> => {
  try {
    const escrow = await EscrowMetadata.findById(req.params.id)
      .populate('userId', 'name email walletAddress');

    if (!escrow) {
      res.status(404).json({ message: 'Escrow not found' });
      return;
    }

    res.json({ escrow });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateEscrow = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, imageUrl } = req.body;
    
    const escrow = await EscrowMetadata.findById(req.params.id);
    if (!escrow) {
      res.status(404).json({ message: 'Escrow not found' });
      return;
    }

    // Check ownership or admin
    if (escrow.userId.toString() !== req.user!.userId && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    if (status) escrow.status = status;
    if (imageUrl) escrow.imageUrl = imageUrl;

    await escrow.save();

    res.json({ message: 'Escrow updated', escrow });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserEscrows = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId || req.user!.userId;

    const escrows = await EscrowMetadata.find({ userId })
      .sort({ createdAt: -1 });

    res.json({ escrows });
  } catch (error: any) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};