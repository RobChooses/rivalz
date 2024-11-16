"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FanToken } from "../lib/fantokendata";
import RPC from "../lib/viewRPC";
import { IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { useWeb3Auth } from "@/context/Web3AuthContext";

const FanTokenBalances: React.FC = () => {
  const { connected, provider, publicClient, walletClient } = useWeb3Auth();
  const [ userBalance, setUserBalance ] = useState("0.00");

  const [assetDictionary, setAssetDictionary] = useState<Record<string, FanToken>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getFanTokenBalances();
  }, [provider]);

  const createBetEvents = async (tokens: Record<string, FanToken>) => {
    try {
      const tokensWithBalance = Object.values(tokens)
        .filter(token => Number(token.balance) > 0)
        .map(token => token.name);

      const response = await fetch('http://localhost:5000/api/create-bet-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamNames: tokensWithBalance
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create bet events');
      }

      const data = await response.json();
      console.log('Bet events created:', data);
    } catch (err) {
      console.error('Error creating bet events:', err);
      setError(err instanceof Error ? err.message : 'Failed to create bet events');
    }
  };

  const getFanTokenBalances = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!connected) {
        return;
      }
      
      while (!provider) {
        console.log("Waiting for provider to be ready...");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      const fanTokenBalances = await RPC.getFanTokenBalances(provider);
      setAssetDictionary(fanTokenBalances);

      if (Object.keys(fanTokenBalances).length > 0) {
        await createBetEvents(fanTokenBalances);
      }
    } catch (err) {
      console.error('Error fetching fan token balances:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch fan token balances');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {isLoading && (
        <div className="col-span-full text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
          <p className="mt-2 text-gray-400">Loading fan tokens...</p>
        </div>
      )}
      {error && (
        <div className="col-span-full text-center py-8 text-rose-500">
          {error}
        </div>
      )}
      {Object.entries(assetDictionary).length > 0 && (
        <h2 className="col-span-full text-2xl font-bold text-gray-600 mb-6">Your Fan Tokens</h2>
      )}
      {connected && Object.entries(assetDictionary).map(([key, token]) => (
        <div 
          key={key}
          className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-6 backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{token.name}</h3>
              <p className="text-sm text-gray-400">{token.token}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Balance:</span>
              <span className="font-medium">{Number(token.balance).toLocaleString()}</span>
            </div>
            
            <a
              href={`https://spicy-chiliz.cloud.blockscout.com/token/${token.contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center justify-end gap-1 transition-colors"
            >
              View on Explorer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      ))}
      {Object.keys(assetDictionary).length === 0 && connected && (
        <div className="col-span-full text-center py-8 text-gray-400">
          No fan tokens found in your wallet
        </div>
      )}
      {!connected && (
        <div className="col-span-full text-center py-8 text-gray-400">
          Connect your wallet to view your fan tokens
        </div>
      )}
    </div>
  );
};

export default FanTokenBalances;
