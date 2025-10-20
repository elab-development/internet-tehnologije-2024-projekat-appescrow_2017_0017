import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../contexts/Web3Context';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { account, connectWallet, disconnectWallet } = useWeb3();

  const handleWalletToggle = () => {
    if (account) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Escrow DApp
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-blue-200">
                Dashboard
              </Link>
              <Link to="/escrows" className="hover:text-blue-200">
                Browse Escrows
              </Link>
              <Link to="/create" className="hover:text-blue-200">
                Create Escrow
              </Link>

              <button
                onClick={handleWalletToggle}
                className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
              >
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
              </button>

              <span className="text-sm">Welcome, {user.name}</span>
              
              <button
                onClick={logout}
                className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;