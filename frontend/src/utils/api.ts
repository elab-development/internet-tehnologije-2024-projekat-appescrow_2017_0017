import axios from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, User, EscrowMetadata } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  getProfile: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Escrow endpoints
export const escrowAPI = {
  createMetadata: async (data: any): Promise<{ escrow: EscrowMetadata }> => {
    const response = await api.post('/escrows', data);
    return response.data;
  },

  getAllEscrows: async (params?: any): Promise<{ escrows: EscrowMetadata[]; pagination: any }> => {
    const response = await api.get('/escrows', { params });
    return response.data;
  },

  getEscrowById: async (id: string): Promise<{ escrow: EscrowMetadata }> => {
    const response = await api.get(`/escrows/${id}`);
    return response.data;
  },

  updateEscrow: async (id: string, data: any): Promise<{ escrow: EscrowMetadata }> => {
    const response = await api.put(`/escrows/${id}`, data);
    return response.data;
  },

  getUserEscrows: async (userId: string): Promise<{ escrows: EscrowMetadata[] }> => {
    const response = await api.get(`/escrows/users/${userId}/escrows`);
    return response.data;
  },
};

export default api;