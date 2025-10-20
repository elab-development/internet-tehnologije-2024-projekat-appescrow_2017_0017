export interface User {
  id: string;
  email: string;
  name: string;
  walletAddress?: string;
  role: 'user' | 'admin' | 'guest';
  avatar?: string;
}

export interface EscrowMetadata {
  _id: string;
  contractEscrowId: number;
  userId: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  buyerAddress: string;
  sellerAddress: string;
  arbiterAddress?: string;
  status: 'active' | 'completed' | 'disputed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface EscrowBlockchainData {
  buyer: string;
  seller: string;
  arbiter: string;
  amount: bigint;
  state: number;
  description: string;
  buyerApproved: boolean;
  sellerDelivered: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  walletAddress?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}