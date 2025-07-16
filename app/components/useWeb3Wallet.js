'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import useAppStore from '../stores/useAppStore';

export default function useWeb3Wallet() {
  const [userAddress, setUserAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenContract, setTokenContract] = useState(null);
  const [balance, setBalance] = useState('0');
  const [network, setNetwork] = useState(null);

  // Zustand store integration
  const { updateWalletConnection, addNotification, updatePortfolio } = useAppStore();

  // --- Kontrat adresi ve ABI güncellemesi ---
  const BASE_CHAIN_ID = '0x2105'; // Base Mainnet
  const TOKEN_CONFIG = {
    address: '0xF87A2A0ADcBE4591d8d013171E6f1552D2349004',
    decimals: 18,
    symbol: 'HUNGX',
    name: 'Hungerium'
  };
  const HUNGERIUM_TOKEN_ABI = [
    // ... (BURAYA KULLANICININ VERDİĞİ GÜNCEL ABI'Yİ YAPIŞTIR) ...
  ];
  // --- Kontrat adresi ve ABI güncellemesi ---

  // Format balance
  const formatBalance = (value) => {
    const num = parseFloat(value);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  // Check connection on load
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.log('Connection check failed:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // --- Ağ kontrolü güncellemesi ---
  const getNetwork = async () => {
    if (!window.ethereum) return null;
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    return { chainId };
  };
  // --- Ağ kontrolü güncellemesi ---

  // Get token balance
  const getTokenBalance = async (address) => {
    if (!window.ethereum || !address) return '0';
    
    try {
      const { ethers } = await import('ethers');
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      const tokenABI = [
        "function balanceOf(address) view returns (uint256)",
        "function symbol() view returns (string)",
        "function decimals() view returns (uint8)",
        "event Transfer(address indexed from, address indexed to, uint256 value)"
      ];
      
      const contract = new ethers.Contract(TOKEN_CONFIG.address, tokenABI, provider);
      const balance = await contract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.log('Balance check failed:', error);
      return '0';
    }
  };

  // --- Wallet bağlantısı sırasında ağ kontrolü ---
  const connectWallet = async () => {
    if (!window.ethereum) {
      const errorMessage = 'MetaMask not detected. Please install MetaMask.';
      addNotification({
        type: 'error',
        title: 'Wallet Not Found',
        message: errorMessage
      });
      toast.error(errorMessage);
      return false;
    }

    setIsLoading(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setUserAddress(address);
        setIsConnected(true);
        
        // Get network info
        const networkInfo = await getNetwork();
        setNetwork(networkInfo);
        if (networkInfo.chainId !== BASE_CHAIN_ID) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_CHAIN_ID }],
          });
        }
        
        // Get token balance
        const tokenBalance = await getTokenBalance(address);
        setBalance(tokenBalance);
        
        // Setup contract
        const { ethers } = await import('ethers');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Use the full ABI provided by the user for all staking and balance functions
        const contract = new ethers.Contract(TOKEN_CONFIG.address, HUNGERIUM_TOKEN_ABI, signer);
        setTokenContract(contract);
        
        // Update store
        updateWalletConnection({
          address: address,
          isConnected: true,
          chainId: networkInfo?.chainId
        });

        updatePortfolio({
          balance: parseFloat(tokenBalance)
        });

        // Success notification
        addNotification({
          type: 'success',
          title: 'Wallet Connected',
          message: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
        });

        return true;
      }
    } catch (error) {
      console.log('Connection failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  // --- Wallet bağlantısı sırasında ağ kontrolü ---

  // Disconnect wallet function
  const disconnectWallet = () => {
    setUserAddress(null);
    setIsConnected(false);
    setTokenContract(null);
    setBalance('0');
    setNetwork(null);
    updateWalletConnection({
      address: null,
      isConnected: false,
      chainId: null
    });
    updatePortfolio({
      balance: 0
    });
    addNotification({
      type: 'success',
      title: 'Wallet Disconnected',
      message: 'You have been disconnected from your wallet.'
    });
  };

  // Switch to BSC function
  const switchToBSC = async () => {
    if (!window.ethereum) {
      const errorMessage = 'MetaMask not detected. Please install MetaMask.';
      addNotification({
        type: 'error',
        title: 'Wallet Not Found',
        message: errorMessage
      });
      toast.error(errorMessage);
      return false;
    }

    setIsLoading(true);
    
    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        const address = accounts[0];
        setUserAddress(address);
        setIsConnected(true);
        
        // Get network info
      const networkInfo = await getNetwork();
      setNetwork(networkInfo);
      
        // Get token balance
        const tokenBalance = await getTokenBalance(address);
        setBalance(tokenBalance);
        
        // Setup contract
        const { ethers } = await import('ethers');
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();

        // Use the full ABI provided by the user for all staking and balance functions
        const contract = new ethers.Contract(TOKEN_CONFIG.address, HUNGERIUM_TOKEN_ABI, signer);
        setTokenContract(contract);
        
        // Update store
        updateWalletConnection({
          address: address,
          isConnected: true,
          chainId: networkInfo?.chainId
        });

        updatePortfolio({
          balance: parseFloat(tokenBalance)
        });

        // Success notification
          addNotification({
            type: 'success',
          title: 'Wallet Connected',
          message: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`
          });

          return true;
      }
    } catch (error) {
      console.log('Connection failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh balance function
  const refreshBalance = async () => {
    if (!userAddress) return;
    
    try {
      const tokenBalance = await getTokenBalance(userAddress);
      setBalance(tokenBalance);
      updatePortfolio({
        balance: parseFloat(tokenBalance)
      });
    } catch (error) {
      console.log('Balance refresh failed:', error);
    }
  };

  return { 
    userAddress,
    isConnected,
    isLoading,
    tokenContract,
    balance: formatBalance(balance),
    rawBalance: balance,
    network,
    connectWallet, 
    disconnectWallet,
    switchToBSC,
    refreshBalance,
    TOKEN_CONFIG
  };
}