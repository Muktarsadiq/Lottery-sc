const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
  let Lottery;
  let lottery;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy the Lottery contract
    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy();
    //await lottery.deployed();
  });

  it("Should allow players to enter the lottery", async function () {
    // Enter the lottery as player1 and player2
    await lottery.connect(player1).enter({ value: ethers.parseEther("0.001") });
    await lottery.connect(player2).enter({ value: ethers.parseEther("0.001") });

    // Check if players were added
    const isPlayer1 = await lottery.isPlayer(player1.address);
    const isPlayer2 = await lottery.isPlayer(player2.address);

    expect(isPlayer1).to.equal(true);
    expect(isPlayer2).to.equal(true);
  });

  it("Should pick a winner and allow the winner to claim the prize", async function () {
    // Deploy a new instance of the Lottery contract
    const Lottery = await ethers.getContractFactory("Lottery");
    const lottery = await Lottery.deploy();
    //await lottery.deployed();

    // Mock entering players
    const [owner, player1, player2] = await ethers.getSigners();
    await lottery.connect(player1).enter({ value: ethers.parseEther("0.001") });
    await lottery.connect(player2).enter({ value: ethers.parseEther("0.001") });

    // Pick a winner
    await lottery.connect(owner).pickWinner();

    // Get the winner
    const winner = await lottery.winner();

    // Check that the winner is one of the players
    expect(winner).to.equal(player1.address).or.equal(player2.address);

    // Simulate the claim process by calling claimPrize on the winner's behalf
    if (winner === player1.address) {
      // Player 1 is the winner
      await lottery.connect(player1).claimPrize();
    } else {
      // Player 2 is the winner
      await lottery.connect(player2).claimPrize();
    }

    // Verify that the prize has been claimed
    const claimed = await lottery.claimed();
    expect(claimed).to.equal(true);
  });




  it("Should not allow non-owners to pick a winner", async function () {
    // Try to pick a winner as player1 (non-owner)
    await expect(lottery.connect(player1).pickWinner()).to.be.revertedWith("Only the contract manager can call this");
  });

  it("Should not allow participants to pick a winner", async function () {
    // Enter the lottery as player1
    await lottery.connect(player1).enter({ value: ethers.parseEther("0.001") });

    // Try to pick a winner as player1 (participant)
    await expect(lottery.connect(player1).pickWinner()).to.be.revertedWith("Only the contract manager can call this");
  });

  it("Should not allow claiming prize before a winner is picked", async function () {
    // Enter the lottery as player1
    await lottery.connect(player1).enter({ value: ethers.parseEther("0.001") });

    // Try to claim the prize as player1 before a winner is picked
    await expect(lottery.connect(player1).claimPrize()).to.be.revertedWith("Lottery is not complete");
  });

  it("Should not allow non-participants to claim the prize", async function () {
    // Enter the lottery as player1 and player2
    await lottery.connect(player1).enter({ value: ethers.parseEther("0.001") });
    await lottery.connect(player2).enter({ value: ethers.parseEther("0.001") });

    // Pick a winner
    await lottery.pickWinner();
    const winner = await lottery.winner();

    // Try to claim the prize as an address that didn't participate (owner in this case)
    await expect(lottery.connect(owner).claimPrize()).to.be.revertedWith("Only the winner can claim the prize");
  });
});
