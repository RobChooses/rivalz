import { useEffect, useState } from "react";
import { chainConfig } from "../fantokens/chilizconfig";
import SignClient from "./SignClient";
import EthereumRPC from "./ethereumRPC";
import { IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";

const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "";

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
  privateKeyProvider,
});

// import { ethers } from 'ethers';
// import BettingContractABI from '~~/../../../hardhat/deployments/spicy/BettingContract.json'; // Replace with the path to your contract ABI

interface CreateBetProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBet: React.FC<CreateBetProps> = ({ isOpen, onClose }: CreateBetProps) => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [statementInput, setStatementInput] = useState("");
  const [dateInput, setDateInput] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);
        // if (web3auth.connected) {
        //   setLoggedIn(true);
        // }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  // const [teamAToken, setTeamAToken] = useState('');
  // const [teamBToken, setTeamBToken] = useState('');
  // const [betToken, setBetToken] = useState('');
  // const [amount, setAmount] = useState('');
  // const [platformFee, setPlatformFee] = useState('');
  // const [contractAddress, setContractAddress] = useState(''); // Replace with your contract address

  const createBet = async () => {
    if (!provider) {
      return;
    }

    const ethereumRPC = new EthereumRPC(provider!);
    const signClient = new SignClient(ethereumRPC.walletClient);
    console.log("Creating Attestation...");

    await ethereumRPC.getAccount();
    await signClient.attest(statementInput, dateInput);

    onClose();
  };
  // try {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(contractAddress, BettingContractABI, signer);
  //   const tx = await contract.createBet(
  //     teamAToken,
  //     teamBToken,
  //     betToken,
  //     ethers.utils.parseUnits(amount, 18), // Assuming the amount is in Ether
  //     statement,
  //     { value: ethers.utils.parseUnits(platformFee, 18) } // Platform fee in Ether
  //   );
  //   await tx.wait();
  //   alert('Bet created successfully!');
  //   onClose(); // Close the modal after successful bet creation
  // } catch (error) {
  //   console.error(error);
  //   alert('Error creating bet');
  // }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-white">Create a prediction against one of your rival teams!</h2>
        <h2 className="text-1xl font-bold mb-4 text-white">This will cost 1 CHZ</h2>
        <form>
          {/* <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Team A Token Address:</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={teamAToken}
              onChange={(e) => setTeamAToken(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Team B Token Address:</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={teamBToken}
              onChange={(e) => setTeamBToken(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Bet Token Address:</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={betToken}
              onChange={(e) => setBetToken(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Amount:</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div> */}
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Your betting prediction:</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={statementInput}
              onChange={e => setStatementInput(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">On what date and time:</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={dateInput}
              onChange={e => setDateInput(e.target.value)}
            />
          </div>
          {/* <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Platform Fee (Ether):</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={platformFee}
              onChange={(e) => setPlatformFee(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Contract Address:</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
            />
          </div> */}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={createBet}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBet;
