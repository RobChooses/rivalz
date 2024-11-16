'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Web3Auth, Web3AuthOptions } from '@web3auth/modal';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider, WEB3AUTH_NETWORK, IAdapter, IProvider} from '@web3auth/base';
import { EthereumPrivateKeyProvider } from '@web3auth/ethereum-provider';
import { getDefaultExternalAdapters } from '@web3auth/default-evm-adapter';
import { WalletClient, PublicClient, createPublicClient, createWalletClient, custom, http } from 'viem';
import { spicy } from 'viem/chains'

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

console.log("clientId", clientId);

interface Web3AuthContextProps {
  web3auth: Web3Auth | null;
  provider: SafeEventEmitterProvider | null;
  // provider: IProvider | null;
  connected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  publicClient: any;
  walletClient: WalletClient | any;
  userAddresses: string[];
}

const Web3AuthContext = createContext<Web3AuthContextProps | undefined>(undefined);

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (!context) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider');
  }
  return context;
};

export const Web3AuthProvider = ({ children }: { children: ReactNode }) => {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(null);
  // const [provider, setProvider] = useState<IProvider | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  // const [publicClient, setPublicClient] = useState<ReturnType<typeof createPublicClient> | null>(null);
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [userAddresses, setUserAddresses] = useState<string[]>([]);

  // Spicy Chiliz Testnet
  const chainConfig = {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x15b32", // 88882
    rpcTarget: "https://spicy-rpc.chiliz.com/",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Spicy Chiliz Testnet",
    blockExplorerUrl: "https://spicy-chiliz.cloud.blockscout.com/",
    ticker: "CHZ",
    tickerName: "Chiliz",
    logo: "",
  };

  const privateKeyProvider = new EthereumPrivateKeyProvider({
    config: { chainConfig },
  });

  const web3AuthOptions: Web3AuthOptions = {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    privateKeyProvider,
    uiConfig: {
      modalZIndex: "2147483647",
      uxMode: "redirect",
    }
  }

  useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth(web3AuthOptions);
        const adapters = await getDefaultExternalAdapters({ options: web3AuthOptions });
        adapters.forEach((adapter: IAdapter<unknown>) => {
          web3auth.configureAdapter(adapter);
        });
        setWeb3auth(web3auth);

        await web3auth.initModal();

        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setConnected(true);

          const publicClient = createPublicClient({
            chain: spicy,
            transport: custom(privateKeyProvider)
          })
          setPublicClient(publicClient);

          const walletClient = createWalletClient({
            chain: spicy,
            transport: custom(privateKeyProvider)
          });
          setWalletClient(walletClient);
        }

      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const connectWallet = async () => {
    if (!web3auth) return;

    try {
      await web3auth.connect();
      const provider = web3auth.provider;
      setProvider(provider);
      setConnected(true);

    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = async () => {
    if (!web3auth) return;

    try {
      await web3auth.logout();
      setProvider(null);
      setConnected(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Web3AuthContext.Provider value={{ web3auth, provider, connected, connectWallet, disconnectWallet, publicClient, walletClient, userAddresses }}>
      {children}
    </Web3AuthContext.Provider>
  );
};
