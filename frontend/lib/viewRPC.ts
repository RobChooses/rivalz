import { createWalletClient, createPublicClient, custom, formatEther, parseEther } from 'viem'
import { SafeEventEmitterProvider } from '@web3auth/base';
import { mainnet, sepolia, spicy, chiliz } from 'viem/chains'
import type { IProvider } from "@web3auth/base";

const getViewChain = (provider: IProvider) => {
  switch (provider.chainId) {
    case "0xaa36a7":
      return sepolia;
    case "0x15B38":
        return chiliz;
    case "0x15b32":
        return spicy;
    default:
      return mainnet;
  }
}

const getChainId = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      transport: custom(provider)
    })

    const address = await walletClient.getAddresses()
    console.log(address)

    const chainId = await walletClient.getChainId()
    return chainId.toString();
  } catch (error) {
    return error;
  }
}
const getAccounts = async (provider: SafeEventEmitterProvider): Promise<any> => {
  try {

    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(provider)
    });

    const address = await walletClient.getAddresses();

    return address;
  } catch (error) {
    return error;
  }
}

const getBalance = async (provider: SafeEventEmitterProvider): Promise<string> => {
  try {
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: custom(provider)
    })

    const walletClient = createWalletClient({
      chain: sepolia,
      transport: custom(provider)
    });

    const address = await walletClient.getAddresses();

    const balance = await publicClient.getBalance({ address: address[0] });
    console.log(balance)
    return formatEther(balance);
  } catch (error) {
    return error as string;
  }
}

const sendTransaction = async (provider: IProvider): Promise<any> => {
  try {
    const publicClient = createPublicClient({
      chain: getViewChain(provider),
      transport: custom(provider)
    })

    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider)
    });

    // data for the transaction
    const destination = "0x0000000000000000000000000000000000000000";
    const amount = parseEther("0.0001");
    const address = await walletClient.getAddresses();

    // Submit transaction to the blockchain
    const hash = await walletClient.sendTransaction({
      account: address[0],
      to: destination,
      value: amount,
    });
    console.log(hash)
    const receipt = await publicClient.waitForTransactionReceipt({ hash });


    return JSON.stringify(receipt, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value // return everything else unchanged
    );
  } catch (error) {
    return error;
  }
}

const signMessage = async (provider: IProvider): Promise<any> => {
  try {
    const walletClient = createWalletClient({
      chain: getViewChain(provider),
      transport: custom(provider)
    });

    // data for signing
    const address = await walletClient.getAddresses();
    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const hash = await walletClient.signMessage({
      account: address[0],
      message: originalMessage
    });

    console.log(hash)

    return hash.toString();
  } catch (error) {
    return error;
  }
}

export default {getChainId, getAccounts, getBalance, sendTransaction, signMessage};
