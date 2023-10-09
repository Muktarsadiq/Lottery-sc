const { ethers } = require("hardhat");

async function main() {
  // Get the accounts from Hardhat's Ethereum provider
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Get the contract factory for your Lottery contract
  const Lottery = await ethers.getContractFactory("Lottery");

  // Deploy the contract
  const lottery = await Lottery.deploy();

  console.log("Lottery deployed to:", lottery.address);
}

// Execute the deployment function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
