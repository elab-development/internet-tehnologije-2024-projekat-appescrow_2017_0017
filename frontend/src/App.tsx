import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Web3Provider, useWeb3 } from './contexts/Web3Context';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEscrow from './pages/CreateEscrow';
import BrowseEscrows from './pages/BrowseEscrows';
import EscrowDetail from './pages/EscrowDetail';

// Protected Route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return user ? <React.Fragment>{children}</React.Fragment> : <Navigate to="/login" />;
};

// Temporary Dashboard placeholder
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { account, connectWallet } = useWeb3();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}!</h2>
        <p className="text-gray-600 mb-4">Email: {user?.email}</p>
        <p className="text-gray-600 mb-4">Role: {user?.role}</p>
        
        {account ? (
          <p className="text-green-600">
            Connected Wallet: {account}
          </p>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Connect MetaMask
          </button>
        )}
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">Blockchain Escrow Platform</h1>
        <p className="text-xl text-gray-600 mb-8">Secure transactions with smart contracts on Ethereum</p>
        <div className="space-x-4">
          <a href="/register" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition">Get Started</a>
          <a href="/login" className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg hover:bg-gray-300 transition">Login</a>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Web3Provider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateEscrow />
                  </ProtectedRoute>
                }
              />
              <Route path="/escrows" element={<BrowseEscrows />} />
              <Route path="/escrows/:id" element={<EscrowDetail />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Web3Provider>
      </AuthProvider>
    </Router>
  );
}

export default App;