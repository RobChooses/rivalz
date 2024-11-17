// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ONE_GWEI: bigint = 1_000_000_000n;

const BettingEventsModule = buildModule("BettingEventsModule", (m) => {
  // Deploy the BettingEvents contract
  const bettingEvents = m.contract("BettingEvents", [], {
    // Optional deployment configuration
    gasPrice: ONE_GWEI,
    // If your contract has a constructor with parameters, add them in the array above
  });

  return {
    bettingEvents, // Return the deployed contract instance
  };
});

export default BettingEventsModule;
