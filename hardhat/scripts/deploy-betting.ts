import { ethers } from "hardhat";

async function main() {
  const BettingEvents = await ethers.getContractFactory("BettingEvents");
  const bettingEvents = await BettingEvents.deploy();
  await bettingEvents.waitForDeployment();

  console.log("BettingEvents deployed to:", await bettingEvents.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 