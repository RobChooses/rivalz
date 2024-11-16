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
          <div>{userAccounts}
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
