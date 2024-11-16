import { useWeb3Auth } from '../context/Web3AuthContext';

import RPC from "../lib/viewRPC";
import { useEffect, useState } from 'react';

const WalletAddress: React.FC = () => {
  const { connected, provider, publicClient, walletClient } = useWeb3Auth();

  const [ userAccounts, setUserAccounts ] = useState("");

  const getAddress = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return "Not connected"
    }
    const address = await RPC.getAccounts(provider);
    if (address) {
      console.log('Accounts: ', address[0]);
      setUserAccounts(address[0]);
    }
  };

  useEffect(() => {
    getAddress();
  }, []);

  return (
    <div className="flex items-center space-x-4 text-white">
      <div>
        Address: 
        <div>
            {connected? (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[500px]">{userAccounts}</span>
            <button
              onClick={() => navigator.clipboard.writeText(userAccounts)}
              className="hover:text-gray-300 transition-colors"
              aria-label="Copy wallet address to clipboard"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" 
                />
              </svg>
            </button>
            <a
              href={`https://spicy-chiliz.cloud.blockscout.com/address/${userAccounts}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
              aria-label="View address on block explorer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
        ) : (
          <div>wallet not connected
          </div>
        )}
        </div>
      </div>
    </div>
  );
};


export default WalletAddress;
