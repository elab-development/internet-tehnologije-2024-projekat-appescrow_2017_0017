import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { escrowAPI } from '../utils/api';
import { EscrowMetadata } from '../types';

const BrowseEscrows: React.FC = () => {
  const [escrows, setEscrows] = useState<EscrowMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    category: '',
    status: ''
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchEscrows();
  }, [page, filter]);

  const fetchEscrows = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 10 };
      if (filter.category) params.category = filter.category;
      if (filter.status) params.status = filter.status;

      const response = await escrowAPI.getAllEscrows(params);
      setEscrows(response.escrows);
      setTotalPages(response.pagination.pages);
    } catch (error) {
      console.error('Error fetching escrows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'disputed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && escrows.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading escrows...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Browse Escrows</h1>
        <Link
          to="/create"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Create New Escrow
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={filter.category}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="services">Services</option>
            <option value="real-estate">Real Estate</option>
            <option value="vehicles">Vehicles</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status"
            value={filter.status}
            onChange={handleFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Escrow List */}
      {escrows.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No escrows found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {escrows.map((escrow) => (
            <Link
              key={escrow._id}
              to={`/escrows/${escrow._id}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{escrow.title}</h3>
                  <p className="text-gray-600 mb-3">{escrow.description}</p>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-500">
                      Category: <span className="font-medium text-gray-700">{escrow.category}</span>
                    </span>
                    <span className="text-gray-500">
                      Escrow ID: <span className="font-medium text-gray-700">#{escrow.contractEscrowId}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(escrow.status)}`}>
                    {escrow.status}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BrowseEscrows;