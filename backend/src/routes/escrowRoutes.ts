import express from 'express';
import {
  createEscrowMetadata,
  getAllEscrows,
  getEscrowById,
  updateEscrow,
  getUserEscrows
} from '../controllers/escrowController';
import { authenticate, authorize } from '../middleware/auth';

const router = express.Router();

// POST /api/escrows - Create escrow metadata (protected)
router.post('/', authenticate, createEscrowMetadata);

// GET /api/escrows - Get all escrows with pagination and filters
router.get('/', getAllEscrows);

// GET /api/escrows/:id - Get single escrow by ID
router.get('/:id', getEscrowById);

// PUT /api/escrows/:id - Update escrow (protected, owner or admin)
router.put('/:id', authenticate, updateEscrow);

// GET /api/users/:userId/escrows - Get user's escrows (nested route)
router.get('/users/:userId/escrows', authenticate, getUserEscrows);

export default router;