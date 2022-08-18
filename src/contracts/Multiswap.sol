// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;
import "./IERC20.sol";
import "./Irouter.sol";

contract Multiswap {
    Irouter router;
    IERC20 erc20;
    address public owner;
    address public constant WETH = 0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83;

    uint256[] amountsArray;

    constructor(address _router) {
        // for now, we put the default router; in the future, we will inidicate in code which to use
        owner = msg.sender;
        router = Irouter(_router);
    }

    // swap eth by percentage for another token
    // 1~10000
    // *** use memory or calldata ??? which is better
    function swapEthForMultipleTokensByPercent(
        address[] memory poolAddresses,
        uint256[] memory percentForEachToken
    ) public payable correctPercentageInput(percentForEachToken) {
        require(
            poolAddresses.length == percentForEachToken.length,
            "Error: pool and percentage array doesnt match"
        );
        require(msg.value > 0, "Error: must be more than 0 ETH");

        delete amountsArray; // for test

        for (uint256 i; i < poolAddresses.length; i++) {
            address[] memory path = new address[](2);
            path[0] = WETH;
            path[1] = poolAddresses[i];
            // router.swapExactETHForTokens(amountOutMin, path, to, deadline);
            uint256 tokenAmount = router.swapExactETHForTokens{
                value: (msg.value * percentForEachToken[i]) / 10000
            }(1, path, msg.sender, block.timestamp)[1];
            amountsArray.push(tokenAmount);
        }
    }

    function getAmountsArray() public view returns (uint256[] memory) {
        return amountsArray;
    }

    modifier correctPercentageInput(uint256[] memory percentForEachToken) {
        uint256 amount;
        for (uint256 i; i < percentForEachToken.length; i++) {
            amount += percentForEachToken[i];
        }
        require(
            amount == 10000,
            "Error: percentage array doesn't add up to 100% or 10,000bps"
        );
        _;
    }
}
