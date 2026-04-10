import { ethers } from 'ethers';
import TipPostABI from './abi/TipPost.json';

// Contract address from environment variable
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

// Contract ABI
export const CONTRACT_ABI = TipPostABI;

// Chain ID (Sepolia)
export const CHAIN_ID = BigInt(import.meta.env.VITE_CHAIN_ID || '11155111');

// Sepolia RPC URL for read operations
export const SEPOLIA_RPC_URL = import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org';

// Sepolia WebSocket URL for event subscriptions
export const SEPOLIA_WSS_URL = import.meta.env.VITE_SEPOLIA_WSS_URL || 'wss://rpc.sepolia.org';

// Minimum tip amount in ETH
export const MINIMUM_TIP_ETH = '0.0001';

// Helper to create contract instance
export function createContract(signer: ethers.Signer): ethers.Contract {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

// Helper to create contract instance with provider (read-only)
export function createContractReadOnly(provider: ethers.Provider): ethers.Contract {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}