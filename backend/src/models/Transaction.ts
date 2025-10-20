import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  escrowId: mongoose.Types.ObjectId;
  txHash: string;
  type: 'create' | 'deposit' | 'release' | 'refund' | 'dispute' | 'resolve';
  status: 'pending' | 'confirmed' | 'failed';
  gasUsed?: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  escrowId: {
    type: Schema.Types.ObjectId,
    ref: 'EscrowMetadata',
    required: true
  },
  txHash: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['create', 'deposit', 'release', 'refund', 'dispute', 'resolve']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  gasUsed: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);