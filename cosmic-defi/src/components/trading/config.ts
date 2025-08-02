// src/config.ts

import Sdk  from '@1inch/cross-chain-sdk'; // Adjust the import path
import { ethers } from 'ethers';

// A helper type for chain configuration
export interface ChainConfig {
  chainId: number;
  name: string;
  url: string;
  resolver: string; // The address of your resolver contract
  escrowFactory: string; // The address of the escrow factory
  wrappedNative: string;
  tokens: {
    [key: string]: {
      address: `0x${string}`;
      decimals: number;
      donor?: `0x${string}`;
    };
  };
}

export const CONFIG: { [key: string]: ChainConfig } = {
  Ethereum: {
    chainId: Sdk.NetworkEnum.ETHEREUM,
    name: 'Ethereum Sepolia',
    url: "https://eth-sepolia.g.alchemy.com/v2/_WS0Xtj7GFWdQdT1TG4TaT7uQOcEuEcw",
    // NOTE: Replace with your actual deployed contract addresses
    resolver: '0xd946F0bc4292a5b83894df44fc931e7852d728ff', // Example address
    escrowFactory: '0x111111125421ca6dc452d289314280a0f8842a65', // Example address
    wrappedNative: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    tokens: {
      USDC: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        decimals: 6,
        donor: '0xd54F23BE482D9A58676590fCa79c8E43087f92fB'
      }
    }
  },
  Monad: {
    chainId: Sdk.NetworkEnum.MONAD,
    name: 'Monad Testnet',
    url: "https://testnet-rpc.monad.xyz",
    resolver: '0xd946F0bc4292a5b83894df44fc931e7852d728ff',
    escrowFactory: '0x...', // Add your Monad Escrow Factory address
    wrappedNative: '0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701',
    tokens: {
      USDC: {
        address: '0x7D0cd861fAC3E694511946695c353534C7c3808B',
        decimals: 6,
        donor: '0xbD16F5B27a507FDDA41AC09Df1cfC04C7213c0C2'
      }
    }
  }
};

// Helper to easily access config by chainId
export const CHAIN_CONFIGS: { [chainId: number]: ChainConfig } = Object.values(CONFIG).reduce((acc, chain) => {
    acc[chain.chainId] = chain;
    return acc;
}, {} as { [chainId: number]: ChainConfig });


export async function getLatestBlockTimestamp(rpcUrl: string): Promise<bigint> {
  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const block = await provider.getBlock('latest')

  if (!block) {
    throw new Error('Failed to fetch latest block')
  }

  return BigInt(block.timestamp)
}
