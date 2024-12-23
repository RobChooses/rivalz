import { createWalletClient, createPublicClient, custom, formatEther, parseEther, erc20Abi, formatUnits } from 'viem'
import { SafeEventEmitterProvider } from '@web3auth/base';
import { mainnet, sepolia, spicy, chiliz } from 'viem/chains'
import type { IProvider } from "@web3auth/base";
import { FanToken, fanTokenData } from './fantokendata';
import BettingEventsABI from '../contracts/BettingEvents.json';

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
      chain: spicy,
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
      chain: spicy,
      transport: custom(provider)
    })

    const walletClient = createWalletClient({
      chain: spicy,
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

// const getFanTokenBalances = async (provider: IProvider): Promise<Record<string, FanToken>> => {
const getFanTokenBalances = async (provider: SafeEventEmitterProvider): Promise<Record<string, FanToken>> => {
  try {
    const publicClient = createPublicClient({
      chain: spicy,
      transport: custom(provider),
    });

    const walletClient = createWalletClient({
      chain: spicy,
      transport: custom(provider),
    });

    // User wallet address
    const address = await walletClient.getAddresses();
    console.log("viewRPC getFanTokenBalances address", address);

    const assetDictionary: Record<string, FanToken> = {};

    const fanTokens = fanTokenData.spicy;

    for (const fanToken of fanTokens) {
      const balance = await publicClient.readContract({
        address: fanToken.contractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [address[0]], // user wallet add
      });
      console.log("# Found balance in %s for token %s of %s", address[0], fanToken.name, balance);
      if (balance > 0) {
        assetDictionary[fanToken.token] = {
          name: fanToken.name,
          balance: formatUnits(balance, Number(fanToken.decimal)),
          decimal: fanToken.decimal,
          token: fanToken.token,
          contractAddress: fanToken.contractAddress,
        };
      }
    }

    return assetDictionary;
  } catch (error) {
    throw new Error("Error fetching fan token");
  }
};

const BETTING_CONTRACT_ADDRESS = "";

const RPC = {
  getChainId,
  getAccounts,
  getBalance,
  sendTransaction,
  signMessage,
  getFanTokenBalances,

  createBettingEvent: async (
    provider: any,
    tokenAddress: string,
    amount: string,
    eventDescription: string
  ) => {
    try {
      const bettingContract = new ethers.Contract(
        BETTING_CONTRACT_ADDRESS,
        BettingEventsABI,
        provider
      );

      // First approve the token spending
      const tokenContract = new ethers.Contract(
        tokenAddress,
        ['function approve(address spender, uint256 amount) public returns (bool)'],
        provider
      );

      const approveTx = await tokenContract.approve(
        BETTING_CONTRACT_ADDRESS,
        ethers.parseUnits(amount, 18)
      );
      await approveTx.wait();

      // Create the bet
      const tx = await bettingContract.createBet(
        tokenAddress,
        ethers.parseUnits(amount, 18),
        eventDescription
      );
      const receipt = await tx.wait();
      
      // Get the BetCreated event from the receipt
      const betCreatedEvent = receipt.events?.find(
        (event: any) => event.event === 'BetCreated'
      );
      
      return {
        betId: betCreatedEvent?.args?.betId.toString(),
        success: true
      };
    } catch (error) {
      console.error('Error creating betting event:', error);
      throw error;
    }
  },

  getUserBets: async (provider: any, userAddress: string) => {
    try {
      const bettingContract = new ethers.Contract(
        BETTING_CONTRACT_ADDRESS,
        BettingEventsABI,
        provider
      );

      const betIds = await bettingContract.getBetsByAddress(userAddress);
      const bets = await Promise.all(
        betIds.map(async (id: number) => {
          const bet = await bettingContract.getBetDetails(id);
          return {
            id,
            bettor: bet.bettor,
            tokenAddress: bet.tokenAddress,
            amount: ethers.formatUnits(bet.amount, 18),
            eventDescription: bet.eventDescription,
            timestamp: new Date(Number(bet.timestamp) * 1000),
            isAttested: bet.isAttested,
            isClaimed: bet.isClaimed
          };
        })
      );

      return bets;
    } catch (error) {
      console.error('Error fetching user bets:', error);
      throw error;
    }
  }
};

export default RPC;
