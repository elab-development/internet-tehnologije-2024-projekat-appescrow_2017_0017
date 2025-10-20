import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { escrowAPI } from '../utils/api';
import { useWeb3 } from '../contexts/Web3Context';
import { EscrowMetadata, EscrowBlockchainData } from '../types';
import { formatEther } from 'ethers';

const EscrowDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { account, contract } = useWeb3();
  const navigate = useNavigate();

  const [metadata, setMetadata] = useState<EscrowMetadata | null>(null);
  const [blockchainData, setBlockchainData] = useState<EscrowBlockchainData | null>(null);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEscrowData();
  }, [id]);

  const fetchEscrowData = async () => {
    try {
      // Fetch metadata from backend
      const response = await escrowAPI.getEscrowById(id!);
      setMetadata(response.escrow);

      // Fetch blockchain data
      if (contract) {
        const escrowId = response.escrow.contractEscrowId;
        const data = await contract.getEscrow(escrowId);
        console.log("Blockchain data fetched:", data);
        setBlockchainData({
          buyer: data[0],
          seller: data[1],
          arbiter: data[2],
          amount: data[3],
          state: Number(data[4]), // ovo me ubilo
          description: data[5],
          buyerApproved: data[6],
          sellerDelivered: data[7],
        });
      } else {
        console.log("Contract not loaded!");
      }
    } catch (err: any) {
      console.error('Error fetching escrow:', err);
      setError('Failed to load escrow');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async () => {
    if (!contract || !metadata) return;
    setTxLoading(true);
    setError('');

    try {
      const tx = await contract.confirmDelivery(metadata.contractEscrowId);
      await tx.wait();
      alert('Delivery confirmed!');
      await fetchEscrowData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  const handleReleasePayment = async () => {
    if (!contract || !metadata) return;
    setTxLoading(true);
    setError('');

    try {
      const tx = await contract.releasePayment(metadata.contractEscrowId);
      await tx.wait();
      alert('Payment released!');
      await escrowAPI.updateEscrow(id!, { status: 'completed' });
      await fetchEscrowData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  const handleRaiseDispute = async () => {
    if (!contract || !metadata) return;
    setTxLoading(true);
    setError('');

    try {
      const tx = await contract.raiseDispute(metadata.contractEscrowId);
      await tx.wait();
      alert('Dispute raised!');
      await escrowAPI.updateEscrow(id!, { status: 'disputed' });
      await fetchEscrowData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  const handleRequestRefund = async () => {
    if (!contract || !metadata) return;
    setTxLoading(true);
    setError('');

    try {
      const tx = await contract.requestRefund(metadata.contractEscrowId);
      await tx.wait();
      alert('Refund processed!');
      await escrowAPI.updateEscrow(id!, { status: 'refunded' });
      await fetchEscrowData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTxLoading(false);
    }
  };

  const getStateLabel = (state: number) => {
    const states = ['Awaiting Payment', 'Awaiting Delivery', 'Complete', 'Disputed', 'Refunded'];
    return states[state] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading escrow details...</div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Escrow not found
        </div>
      </div>
    );
  }

  const isBuyer = account?.toLowerCase() === metadata.buyerAddress.toLowerCase();
  const isSeller = account?.toLowerCase() === metadata.sellerAddress.toLowerCase();

  console.log('Account check:', { 
  account, 
  isBuyer, 
  isSeller,
  buyerAddress: metadata.buyerAddress,
  sellerAddress: metadata.sellerAddress,
  blockchainData: blockchainData ? 'loaded' : 'null',
  state: blockchainData?.state
});

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate("/escrows")}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back to Escrows
      </button>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">{metadata.title}</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Metadata Section */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Description:</span>{" "}
                {metadata.description}
              </p>
              <p>
                <span className="font-medium">Category:</span>{" "}
                {metadata.category}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span className="capitalize">{metadata.status}</span>
              </p>
              <p>
                <span className="font-medium">Escrow ID:</span> #
                {metadata.contractEscrowId}
              </p>
            </div>
          </div>

          {/* Blockchain Data Section */}
          {blockchainData && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Blockchain State</h2>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  {formatEther(blockchainData.amount)} ETH
                </p>
                <p>
                  <span className="font-medium">State:</span>{" "}
                  {getStateLabel(blockchainData.state)}
                </p>
                <p>
                  <span className="font-medium">Buyer:</span>{" "}
                  {blockchainData.buyer.slice(0, 10)}...
                  {blockchainData.buyer.slice(-8)}
                </p>
                <p>
                  <span className="font-medium">Seller:</span>{" "}
                  {blockchainData.seller.slice(0, 10)}...
                  {blockchainData.seller.slice(-8)}
                </p>
                <p>
                  <span className="font-medium">Seller Delivered:</span>{" "}
                  {blockchainData.sellerDelivered ? "Yes ✓" : "No"}
                </p>
                <p>
                  <span className="font-medium">Buyer Approved:</span>{" "}
                  {blockchainData.buyerApproved ? "Yes ✓" : "No"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {account && blockchainData && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>


          <div className="flex flex-wrap gap-3">
            {isSeller &&
              !blockchainData.sellerDelivered &&
              blockchainData.state === 1 && (
                <button
                  onClick={handleConfirmDelivery}
                  disabled={txLoading}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
                >
                  {txLoading ? "Processing..." : "Confirm Delivery"}
                </button>
              )}

            {isBuyer &&
              blockchainData.sellerDelivered &&
              blockchainData.state === 1 && (
                <button
                  onClick={handleReleasePayment}
                  disabled={txLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {txLoading ? "Processing..." : "Release Payment"}
                </button>
              )}

            {isBuyer &&
              !blockchainData.sellerDelivered &&
              blockchainData.state === 1 && (
                <button
                  onClick={handleRequestRefund}
                  disabled={txLoading}
                  className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 disabled:bg-gray-400"
                >
                  {txLoading ? "Processing..." : "Request Refund"}
                </button>
              )}

            {(isBuyer || isSeller) && blockchainData.state === 1 && (
              <button
                onClick={handleRaiseDispute}
                disabled={txLoading}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
              >
                {txLoading ? "Processing..." : "Raise Dispute"}
              </button>
            )}

            {blockchainData.state === 2 && (
              <div className="bg-green-100 text-green-800 px-4 py-2 rounded">
                ✓ Escrow Completed
              </div>
            )}

            {blockchainData.state === 3 && (
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded">
                ⚠ Dispute in Progress
              </div>
            )}
          </div>

          {!isBuyer && !isSeller && (
            <p className="text-gray-600 mt-4">
              You are not a participant in this escrow.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default EscrowDetail;