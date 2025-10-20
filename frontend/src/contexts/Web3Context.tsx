import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BrowserProvider, Contract, Eip1193Provider } from 'ethers';
import EscrowABI from '../contracts/EscrowABI.json';

interface Web3ContextType {
  account: string | null;
  provider: BrowserProvider | null;
  contract: Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isCorrectNetwork: boolean;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS!;
const CHAIN_ID = parseInt(process.env.REACT_APP_CHAIN_ID || '11155111');


export const Web3Provider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

 useEffect(() => {
  const init = async () => {
    console.log('Web3Context initializing...');
    await checkIfWalletIsConnected();
  };
  init();
}, []);

const checkIfWalletIsConnected = async () => {
  console.log('Checking wallet connection...');
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      console.log('Found accounts:', accounts);
      if (accounts.length > 0) {
        const browserProvider = new BrowserProvider(window.ethereum as Eip1193Provider);
        const signer = await browserProvider.getSigner();
        const escrowContract = new Contract(CONTRACT_ADDRESS, EscrowABI, signer);

        const network = await browserProvider.getNetwork();
        console.log('Expected CHAIN_ID:', CHAIN_ID);
        console.log('Current network chainId:', Number(network.chainId));
        console.log('Is correct network:', Number(network.chainId) === CHAIN_ID);
        setIsCorrectNetwork(Number(network.chainId) === CHAIN_ID);

        setAccount(accounts[0]);
        setProvider(browserProvider);
        setContract(escrowContract);
        
        console.log('Auto-connected to:', accounts[0]);
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }
};

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask!');
      return;
    }

    try {
      const browserProvider = new BrowserProvider(window.ethereum as Eip1193Provider);
      const accounts = await browserProvider.send('eth_requestAccounts', []);
      const signer = await browserProvider.getSigner();
      
      const escrowContract = new Contract(CONTRACT_ADDRESS, EscrowABI, signer);

      const network = await browserProvider.getNetwork();
      console.log('Expected CHAIN_ID:', CHAIN_ID);
      console.log('Current network chainId:', Number(network.chainId));
      console.log('Is correct network:', Number(network.chainId) === CHAIN_ID);
      setIsCorrectNetwork(Number(network.chainId) === CHAIN_ID);

      setAccount(accounts[0]);
      setProvider(browserProvider);
      setContract(escrowContract);

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0] || null);
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
  };

  return (
    <Web3Context.Provider value={{ account, provider, contract, connectWallet, disconnectWallet, isCorrectNetwork }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

declare global {
  interface Window {
    ethereum?: any;
  }
}