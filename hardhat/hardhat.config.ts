import * as dotenv from "dotenv";
dotenv.config();


import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const CONTRACT_DEPLOYER_PRIVATE_KEY = process.env.CONTRACT_DEPLOYER_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    spicy: {
      url: `https://spicy-rpc.chiliz.com/`,
      accounts: [CONTRACT_DEPLOYER_PRIVATE_KEY],
    },
  },
};

export default config;
