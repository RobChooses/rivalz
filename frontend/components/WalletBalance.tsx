import { useWeb3Auth } from '../context/Web3AuthContext';

import RPC from "../lib/viewRPC";
import { useEffect, useState } from 'react';

const WalletBalance: React.FC = () => {
  const { connected, provider, publicClient, walletClient } = useWeb3Auth();

  const [ userBalance, setUserBalance ] = useState("0.00");

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return "0.0"
    }
    const balance = await RPC.getBalance(provider);
    if (balance) {
      console.log('Balance: ', balance);
      setUserBalance(balance);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return (
    <div className="flex items-center space-x-4 text-white">
      <div>
        Balance: 
        <div>
          {connected ? (
            <div className="flex items-center gap-2">
              <span>{userBalance} CHZ</span>
              <button
                className="px-3 py-1 text-sm bg-pink-500 hover:bg-pink-600 rounded-md transition-colors"
                onClick={() => window.open('https://app.kayen.org/', '_blank')}
                aria-label="Buy CHZ tokens"
              >
                Buy CHZ
              </button>
            </div>
          ) : (
            <div>wallet not connected</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletBalance;
