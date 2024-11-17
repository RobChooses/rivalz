// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract BettingEvents is Ownable {
    struct Bet {
        address bettor;
        address tokenAddress;
        uint256 amount;
        string eventDescription;
        uint256 timestamp;
        bool isAttested;
        bool isClaimed;
    }

    // Mapping from betId to Bet
    mapping(uint256 => Bet) public bets;
    uint256 public nextBetId;

    // Events
    event BetCreated(
        uint256 indexed betId,
        address indexed bettor,
        address tokenAddress,
        uint256 amount,
        string eventDescription
    );
    event BetAttested(uint256 indexed betId, address indexed attestor);
    event BetClaimed(uint256 indexed betId, address indexed bettor);

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Creates a new betting event
     * @param tokenAddress The address of the fan token being used for the bet
     * @param amount The amount of tokens to bet
     * @param eventDescription The description of the positive event being bet on
     */
    function createBet(
        address tokenAddress,
        uint256 amount,
        string memory eventDescription
    ) external  {
        require(amount > 0, "Amount must be greater than 0");
        require(bytes(eventDescription).length > 0, "Description cannot be empty");

        IERC20 token = IERC20(tokenAddress);
        require(
            token.balanceOf(msg.sender) >= amount,
            "Insufficient token balance"
        );
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Insufficient allowance"
        );

        // Transfer tokens to contract
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");

        // Create new bet
        uint256 betId = nextBetId++;
        bets[betId] = Bet({
            bettor: msg.sender,
            tokenAddress: tokenAddress,
            amount: amount,
            eventDescription: eventDescription,
            timestamp: block.timestamp,
            isAttested: false,
            isClaimed: false
        });

        emit BetCreated(betId, msg.sender, tokenAddress, amount, eventDescription);
    }

    /**
     * @dev Attests that a betting event has occurred (only owner can attest)
     * @param betId The ID of the bet to attest
     */
    function attestBet(uint256 betId) external onlyOwner {
        require(betId < nextBetId, "Bet does not exist");
        require(!bets[betId].isAttested, "Bet already attested");
        
        bets[betId].isAttested = true;
        emit BetAttested(betId, msg.sender);
    }

    /**
     * @dev Allows bettor to claim their winnings after attestation
     * @param betId The ID of the bet to claim
     */
    function claimBet(uint256 betId) external {
        Bet storage bet = bets[betId];
        require(bet.bettor == msg.sender, "Not the bettor");
        require(bet.isAttested, "Bet not attested yet");
        require(!bet.isClaimed, "Bet already claimed");

        bet.isClaimed = true;
        IERC20 token = IERC20(bet.tokenAddress);
        
        // Return original bet amount plus 10% reward
        uint256 rewardAmount = bet.amount + (bet.amount * 10 / 100);
        require(
            token.transfer(msg.sender, rewardAmount),
            "Token transfer failed"
        );

        emit BetClaimed(betId, msg.sender);
    }

    /**
     * @dev Gets all bets for a specific address
     * @param bettor The address to get bets for
     */
    function getBetsByAddress(address bettor) 
        external 
        view 
        returns (uint256[] memory betIds) 
    {
        uint256 count = 0;
        for (uint256 i = 0; i < nextBetId; i++) {
            if (bets[i].bettor == bettor) {
                count++;
            }
        }

        betIds = new uint256[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < nextBetId; i++) {
            if (bets[i].bettor == bettor) {
                betIds[index] = i;
                index++;
            }
        }

        return betIds;
    }

    /**
     * @dev Gets details of a specific bet
     * @param betId The ID of the bet to query
     */
    function getBetDetails(uint256 betId) 
        external 
        view 
        returns (Bet memory) 
    {
        require(betId < nextBetId, "Bet does not exist");
        return bets[betId];
    }
} 