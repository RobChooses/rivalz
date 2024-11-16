// components/WalletConnect.tsx
import { useWeb3Auth } from '../context/Web3AuthContext';

const WalletConnect: React.FC = () => {
  const { connected, connectWallet, disconnectWallet } = useWeb3Auth();

  return (
    <div className="flex items-center space-x-4">
      {connected ? (
        <button
          onClick={disconnectWallet}
          className="px-6 py-2.5 bg-rose-500 text-white rounded-full font-medium hover:bg-rose-600 active:scale-95 transform transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Disconnect Wallet
        </button>
      ) : (
        <button
          onClick={connectWallet}
          className="px-6 py-2.5 bg-indigo-500 text-white rounded-full font-medium hover:bg-indigo-600 active:scale-95 transform transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
