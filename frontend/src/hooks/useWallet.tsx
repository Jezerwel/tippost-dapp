import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ethers } from 'ethers';

// Sepolia chain ID as BigInt
const SEPOLIA_CHAIN_ID = 11155111n;

interface WalletState {
  address: string | null;
  chainId: bigint | null;
  isConnected: boolean;
  isMetaMaskInstalled: boolean;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  error: string | null;
}

interface WalletContextValue {
  state: WalletState;
  connect: () => Promise<void>;
  disconnect: () => void;
  switchNetwork: () => Promise<boolean>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    chainId: null,
    isConnected: false,
    isMetaMaskInstalled: false,
    isCorrectNetwork: false,
    isConnecting: false,
    error: null,
  });

  // Check if MetaMask is installed
  useEffect(() => {
    const checkMetaMask = () => {
      const isInstalled =
        typeof window !== 'undefined' &&
        typeof window.ethereum !== 'undefined' &&
        window.ethereum.isMetaMask === true;
      setState(prev => ({ ...prev, isMetaMaskInstalled: isInstalled }));
    };
    checkMetaMask();
  }, []);

  // Get current account and chain
  const getWalletInfo = useCallback(async () => {
    if (!window.ethereum) return null;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();

      if (accounts.length === 0) return null;

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      return { address, chainId };
    } catch {
      return null;
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: unknown) => {
      const accountList = accounts as string[];
      if (accountList.length === 0) {
        // User disconnected
        setState(prev => ({
          ...prev,
          address: null,
          isConnected: false,
          chainId: null,
          isCorrectNetwork: false,
        }));
      } else {
        // Account switched
        setState(prev => ({
          ...prev,
          address: accountList[0],
        }));
      }
    };

    const handleChainChanged = (chainIdHex: unknown) => {
      const hexString = chainIdHex as string;
      const chainId = BigInt(hexString);
      const isCorrectNetwork = chainId === SEPOLIA_CHAIN_ID;

      setState(prev => ({
        ...prev,
        chainId,
        isCorrectNetwork,
      }));
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, []);

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return;

      const info = await getWalletInfo();
      if (info) {
        setState(prev => ({
          ...prev,
          address: info.address,
          chainId: info.chainId,
          isConnected: true,
          isCorrectNetwork: info.chainId === SEPOLIA_CHAIN_ID,
        }));
      }
    };

    checkConnection();
  }, [getWalletInfo]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState(prev => ({
        ...prev,
        error: 'MetaMask is not installed. Please install MetaMask to continue.',
      }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (accounts.length === 0) {
        throw new Error('No accounts found');
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = network.chainId;

      setState(prev => ({
        ...prev,
        address: accounts[0],
        chainId,
        isConnected: true,
        isCorrectNetwork: chainId === SEPOLIA_CHAIN_ID,
        isConnecting: false,
        error: null,
      }));
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };

      if (err.code === 4001) {
        // User rejected the request
        setState(prev => ({
          ...prev,
          isConnecting: false,
          error: 'Connection request rejected. Please try again.',
        }));
      } else {
        setState(prev => ({
          ...prev,
          isConnecting: false,
          error: err.message || 'Failed to connect wallet',
        }));
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      chainId: null,
      isConnected: false,
      isMetaMaskInstalled: state.isMetaMaskInstalled,
      isCorrectNetwork: false,
      isConnecting: false,
      error: null,
    });
  }, [state.isMetaMaskInstalled]);

  const switchNetwork = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) return false;

    const chainIdHex = '0x' + SEPOLIA_CHAIN_ID.toString(16);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });

      setState(prev => ({
        ...prev,
        chainId: SEPOLIA_CHAIN_ID,
        isCorrectNetwork: true,
      }));

      return true;
    } catch (error: unknown) {
      const err = error as { code?: number };

      if (err.code === 4902) {
        // Chain not added to MetaMask - add it
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: 'Sepolia',
              nativeCurrency: {
                name: 'Sepolia Ether',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });

          setState(prev => ({
            ...prev,
            chainId: SEPOLIA_CHAIN_ID,
            isCorrectNetwork: true,
          }));

          return true;
        } catch {
          setState(prev => ({
            ...prev,
            error: 'Failed to add Sepolia network. Please add it manually.',
          }));
          return false;
        }
      }

      if (err.code === 4001) {
        setState(prev => ({
          ...prev,
          error: 'Network switch rejected.',
        }));
      } else {
        setState(prev => ({
          ...prev,
          error: 'Failed to switch network.',
        }));
      }

      return false;
    }
  }, []);

  return (
    <WalletContext.Provider value={{ state, connect, disconnect, switchNetwork }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}