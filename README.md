# Lottery Smart Contract

![Solidity]

The Lottery smart contract is a simple Ethereum-based decentralized application (DApp) that allows participants to enter a lottery and have a chance to win a prize. This contract is implemented in Solidity and can be deployed on various Ethereum networks, such as the mainnet or testnets.

## Features

- Participants can enter the lottery by sending a minimum entry amount of 0.001 Ether.
- The contract owner (manager) can pick a winner randomly from the list of participants.
- The winner can claim the prize after the lottery is complete.
- The contract ensures that only the owner can initiate the winner selection process.
- Prize distribution is automated, and only the winner can claim the prize.

## Smart Contract Details

- Contract Name: `Lottery`
- Compiler Version: Solidity ^0.8.9

## Deployment

You can deploy the `Lottery` smart contract to various Ethereum networks using tools like [Hardhat](https://hardhat.org/) or [Truffle](https://www.trufflesuite.com/). Here's a simple deployment using Hardhat:

1. Install Hardhat and set up your project.

2. Configure your network settings in the `hardhat.config.js` file.

3. Run the deployment script:

   ```shell
   npx hardhat run scripts/deploy.js --network <network_name>
