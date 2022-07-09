pragma solidity ^0.8.0;
import "./IERC20.sol";
import "./Irouter.sol";

contract Multiswap {
    Irouter router;
    IERC20 erc20;

    address public owner;

    constructor(address _router) {
        // for now, we put the default router; in the future, we will inidicate in code which to use
        owner = msg.sender;
        router = Irouter(_router);
    }

    function swapETHForMultipleTokens(address[] poolAddresses, uint256[] amountOfEachToken) payable{
        for (uint256 i; )
    }
}
