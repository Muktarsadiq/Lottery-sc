// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Lottery {
    address public manager;
    mapping(address => bool) public isPlayer;
    address payable[] public players;
    address payable public winner;
    bool public isComplete;
    bool public claimed;

    // Number of players per page
    uint256 public pageSize = 10;

    // Current page index
    uint256 public currentPage = 0;

    // Store the random result
    uint256 private randomResult;

    event LotteryComplete(); // is called  when the lottery is completed
    event WinnerPicked(address indexed winner); // is called when a winner is selected.
    event PrizeClaimed(address indexed winner, uint256 amount); // is called when a participant claims the prize

    constructor() {
        manager = msg.sender;
        isComplete = false;
        claimed = false;
        randomResult = generateRandomNumber();
    }

    modifier onlyOwner() {
        require(
            msg.sender == manager,
            "Only the contract manager can call this"
        );
        _;
    }

    function enter() public payable {
        /*Allows participants to enter the lottery by sending at least 0.001 Ether. 
        and also adds the participant's address to the players array. */

        require(
            msg.value >= 0.001 ether,
            "Minimum entry amount is 0.001 ether"
        );
        require(!isComplete, "Lottery is already complete");
        players.push(payable(msg.sender));
        isPlayer[msg.sender] = true; // Mark the player as a participant
    }

    function pickWinner() public onlyOwner {
        /* Allows the contract manager to randomly pick a winner from the list of participants,
        and sets the isComplete flag to true. */

        require(players.length > 0, "No players available");
        require(!isComplete, "Lottery is already complete");

        randomResult = generateRandomNumber();
        winner = players[randomResult % players.length];
        isComplete = true;

        emit WinnerPicked(winner);
        emit LotteryComplete();
    }

    function claimPrize() public {
        /*Allows participants to claim the prize if they are the winner. 
        It can only be called by the winner of the lottery and only after the lottery is complete
        and if the prize has not been claimed yet */

        require(isComplete, "Lottery is not complete");
        require(!claimed, "Prize already claimed");
        require(msg.sender == winner, "Only the winner can claim the prize");

        claimed = true;
        uint256 prizeAmount = address(this).balance;
        winner.transfer(prizeAmount);

        emit PrizeClaimed(winner, prizeAmount);
    }

    function getPlayers(uint256 page)
        public
        view
        returns (address payable[] memory)
    {
        /*Allows anyone to retrieve a paginated list of participants */

        require(page >= 0, "Invalid page number");

        uint256 startIdx = page * pageSize;
        uint256 endIdx = startIdx + pageSize;

        if (endIdx > players.length) {
            endIdx = players.length;
        }

        address payable[] memory pagePlayers = new address payable[](
            endIdx - startIdx
        );
        for (uint256 i = startIdx; i < endIdx; i++) {
            pagePlayers[i - startIdx] = players[i];
        }

        return pagePlayers;
    }

    function getRandomResult() public view returns (uint256) {
        /*Allows anyone to retrieve the last random number generated */
        return randomResult;
    }

    // Centralized random number generation function
    function generateRandomNumber() private view returns (uint256) {
        /*this is an internal function that Generates a random number based on the contract's state variables and blockchain data */
        uint256 seed = uint256(
            keccak256(
                abi.encodePacked(
                    block.prevrandao,
                    block.timestamp,
                    players.length
                )
            )
        );
        return
            uint256(
                keccak256(abi.encodePacked(seed, blockhash(block.number - 1)))
            );
    }
}
