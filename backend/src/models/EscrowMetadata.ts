import mongoose, { Document, Schema } from 'mongoose';

export interface IEscrowMetadata extends Document {
  contractEscrowId: number;
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  buyerAddress: string;
  sellerAddress: string;
  arbiterAddress?: string;
  status: 'active' | 'completed' | 'disputed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

const EscrowMetadataSchema = new Schema<IEscrowMetadata>({
  contractEscrowId: {
    type: Number,
    required: true,
    unique: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['electronics', 'services', 'real-estate', 'vehicles', 'other']
  },
  imageUrl: {
    type: String
  },
  buyerAddress: {
    type: String,
    required: true
  },
  sellerAddress: {
    type: String,
    required: true
  },
  arbiterAddress: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'disputed', 'refunded'],
    default: 'active'
  }
}, {
  timestamps: true
});

export default mongoose.model<IEscrowMetadata>('EscrowMetadata', EscrowMetadataSchema);
