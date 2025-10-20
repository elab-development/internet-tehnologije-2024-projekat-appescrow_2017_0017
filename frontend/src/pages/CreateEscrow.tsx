import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';
import { escrowAPI } from '../utils/api';
import { parseEther } from 'ethers';

const CreateEscrow: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    sellerAddress: '',
    arbiterAddress: '',
    amount: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');

  const { user } = useAuth();
  const { account, contract, isCorrectNetwork } = useWeb3();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!account) {
      setError('Please connect your wallet first');
      setLoading(false);
      return;
    }

    if (!isCorrectNetwork) {
      setError('Please switch to Sepolia network');
      setLoading(false);
      return;
    }

    if (!contract) {
      setError('Contract not loaded');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create escrow on blockchain
      const amountInWei = parseEther(formData.amount);
      
      const tx = await contract.createEscrow(
        formData.sellerAddress,
        formData.arbiterAddress || '0x0000000000000000000000000000000000000000',
        formData.description,
        { value: amountInWei }
      );

      setTxHash(tx.hash);
      console.log('Transaction sent:', tx.hash);

      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      // Get the escrow ID from the event
      const escrowCreatedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = contract.interface.parseLog(log);
          return parsed?.name === 'EscrowCreated';
        } catch {
          return false;
        }
      });

      let contractEscrowId = 0;
      if (escrowCreatedEvent) {
        const parsed = contract.interface.parseLog(escrowCreatedEvent);
        contractEscrowId = Number(parsed?.args[0]);
      }

      // Step 2: Save metadata to backend
      await escrowAPI.createMetadata({
        contractEscrowId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        buyerAddress: account,
        sellerAddress: formData.sellerAddress,
        arbiterAddress: formData.arbiterAddress || undefined
      });

      alert('Escrow created successfully!');
      navigate('/escrows');
    } catch (err: any) {
      console.error('Error creating escrow:', err);
      setError(err.message || 'Failed to create escrow');
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please connect your wallet to create an escrow.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Escrow</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {txHash && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
          Transaction Hash: <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="underline">{txHash}</a>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="electronics">Electronics</option>
              <option value="services">Services</option>
              <option value="real-estate">Real Estate</option>
              <option value="vehicles">Vehicles</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount (ETH) *
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              step="0.001"
              min="0.001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seller Address *
            </label>
            <input
              type="text"
              name="sellerAddress"
              value={formData.sellerAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Arbiter Address (Optional)
            </label>
            <input
              type="text"
              name="arbiterAddress"
              value={formData.arbiterAddress}
              onChange={handleChange}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Leave empty if no arbiter is needed</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition text-lg font-semibold"
          >
            {loading ? 'Creating Escrow...' : 'Create Escrow'}
          </button>
        </form>
      </div>

      <div className="mt-6 bg-gray-100 rounded-lg p-4 max-w-2xl">
        <h3 className="font-semibold mb-2">How it works:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
          <li>You deposit ETH into the smart contract</li>
          <li>Seller delivers the goods/services</li>
          <li>You confirm receipt and release payment</li>
          <li>If there's a dispute, the arbiter decides</li>
        </ol>
      </div>
    </div>
  );
};

export default CreateEscrow;