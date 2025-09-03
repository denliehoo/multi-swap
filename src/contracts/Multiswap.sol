// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "./IERC20.sol";
import "./Irouter.sol";
import "./IWETH.sol";

contract Multiswap {
    IERC20 erc20;
    address public contractOwner;
    address public constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14; // wETH on Sepolia
    IWETH wethContract = IWETH(WETH);
    Irouter router = Irouter(0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3); // Sepolia uniswapv2 router



    address NATIVE_ADDRESS_SIMULATION =
        0x0000000000000000000000000000000000000000;

    struct SwapObject {
        address tokenAddress;
        uint256 amount;
    }

    enum ToAddress {
        Sender,
        Contract
    }

    event SwapEthForTokensEvent(uint256 swapFromAmount, SwapObject[] swapTo);
    event SwapTokensForEthEvent(SwapObject[] swapFrom, uint256 swapToAmount);
    event SwapTokensForTokensEvent(SwapObject[] swapFrom, SwapObject[] swapTo);
    event SwapTokensForTokensAndEthEvent(
        SwapObject[] swapFrom,
        SwapObject[] swapTo
    );
    event SwapEthAndTokensForTokensEvent(
        SwapObject[] swapFrom,
        SwapObject[] swapTo
    );

    constructor() {
        // for now, we put the default router; in the future, we will inidicate in code which to use
        contractOwner = msg.sender;
    }

    // checks whether the user has given allowance to the contract
    function allowanceERC20(address token) external view returns (uint256) {
        return IERC20(token).allowance(msg.sender, address(this));
    }

    // ETH -> ERC20s general function
    function internalSwapEthForMultipleTokensByPercent(
        ToAddress toAddress,
        uint256 inputtedEthAmountFromContract,
        address[] memory poolAddresses,
        uint256[] memory percentForEachToken
    )
        public
        payable
        correctPercentageInput(percentForEachToken)
        checkArraysMatch(poolAddresses, percentForEachToken)
        returns (uint256 ethAmount, SwapObject[] memory swapTo)
    {
        swapTo = new SwapObject[](poolAddresses.length);
        address to;
        bool isSendToSender = toAddress == ToAddress.Sender;

        if (isSendToSender) {
            to = msg.sender;
            if (inputtedEthAmountFromContract == 0) {
                ethAmount = msg.value;
            } else {
                ethAmount = inputtedEthAmountFromContract;
                require(address(this).balance >= inputtedEthAmountFromContract, "Error: Contract ETH balance lesser than inputted amount");
            }
        }
        require(ethAmount > 0, "Error: input amount must be more than 0 ETH");
        if (toAddress == ToAddress.Contract) {
            to = address(this);
            ethAmount = inputtedEthAmountFromContract;
        }

        for (uint256 i; i < poolAddresses.length; i++) {
            address[] memory path = new address[](2);
            path[0] = WETH;
            path[1] = poolAddresses[i];
            uint256 ethSwapAmount = (ethAmount * percentForEachToken[i]) / 10000;
            uint256 tokenAmount;

            if(path[0] == path[1]){
                wethContract.deposit{
                    value: ethSwapAmount
                }();
                tokenAmount = ethSwapAmount;
                if(isSendToSender){
                    // Transfer WETH to the sender
                    wethContract.transfer(to, tokenAmount);
                }
            } else {
                // Swap ETH for tokens and transfers it to "to"
                tokenAmount = router.swapExactETHForTokens{
                    value: ethSwapAmount
                }(1, path, to, block.timestamp)[1];
            }
            SwapObject memory swapObject = SwapObject(path[1], tokenAmount);
            swapTo[i] = swapObject;
        }
        return (ethAmount, swapTo);
    }

    // ERC20s -> ETH general function
    function internalSwapMultipleTokensForEth(
        ToAddress toAddress,
        address[] memory poolAddresses,
        uint256[] memory amountForEachTokens
    )
        public
        checkArraysMatch(poolAddresses, amountForEachTokens)
        swapFromAmountsGreaterThanZero(amountForEachTokens)
        returns (SwapObject[] memory swapFrom, uint256 ethAmount)
    {
        swapFrom = new SwapObject[](poolAddresses.length);
        address to;
        
        if (toAddress == ToAddress.Sender) {
            to = msg.sender;
        }
        if (toAddress == ToAddress.Contract) {
            to = address(this);
        }

        for (uint256 i; i < poolAddresses.length; i++) {
            address[] memory path = new address[](2);
            path[0] = poolAddresses[i];
            path[1] = WETH;

            // get the user to send ERC20 tokens to the smart contract
            IERC20(poolAddresses[i]).transferFrom(
                msg.sender,
                address(this),
                amountForEachTokens[i]
            );

            uint256 ethFromSwap;

            if(path[0] == path[1]){
                wethContract.withdraw(amountForEachTokens[i]);
                ethFromSwap = amountForEachTokens[i];
                if(toAddress == ToAddress.Sender){
                    // Transfer ETH to the sender
                    (bool transferSuccess, ) = payable(to).call{value: ethFromSwap}("");
                    require(transferSuccess, "ETH transfer failed");
                }
            } else {
                // get the smart contract to approve sending the erc20 token to the router
                IERC20(poolAddresses[i]).approve(
                    address(router),
                    amountForEachTokens[i]
                );
                // swap ERC20 tokens for ETH and sends it to "to"
                ethFromSwap = router.swapExactTokensForETH(
                    amountForEachTokens[i],
                    1,
                    path,
                    to,
                    block.timestamp
                )[1];
            }
            ethAmount += ethFromSwap;
            SwapObject memory swapObject = SwapObject(path[0], ethFromSwap);
            swapFrom[i] = swapObject;
        }

        return (swapFrom, ethAmount);
    }

    // 1. get amounts out ETH -> ERC20 [tested and works]
    function getAmountsOutEthForMultipleTokensByPercent(
        uint256 ethAmount,
        address[] memory poolAddresses,
        uint256[] memory percentForEachToken
    )
        public
        view
        checkArraysMatch(poolAddresses, percentForEachToken)
        returns (uint256[] memory)
    {
        uint256[] memory returnArray = new uint256[](poolAddresses.length);

        for (uint256 i; i < poolAddresses.length; i++) {
            address[] memory path = new address[](2);
            path[0] = WETH;
            path[1] = poolAddresses[i];

            uint256 inputAmount = (ethAmount * percentForEachToken[i]) / 10000;
            uint256 tokenAmount;
            if (path[0] == path[1]) {
                tokenAmount = inputAmount;
            } else {
                tokenAmount = router.getAmountsOut(inputAmount, path)[1];
            }
            returnArray[i] = (tokenAmount);
        }
        return returnArray;
    }

    // 2. get amounts out ERC20 -> ETH [tested and works]
    function getAmountsOutMultipleTokensForEth(
        address[] memory poolAddresses,
        uint256[] memory amountForEachTokens
    )
        public
        view
        checkArraysMatch(poolAddresses, amountForEachTokens)
        returns (uint256)
    {
        uint256 ethAmount;
        for (uint256 i; i < poolAddresses.length; i++) {
            address[] memory path = new address[](2);
            path[0] = poolAddresses[i];
            path[1] = WETH;
            uint256 amountToAdd;
            
            if(path[0] == path[1]) {
                amountToAdd = amountForEachTokens[i];
            } else {
                amountToAdd = router.getAmountsOut(amountForEachTokens[i], path)[1];
            }
            ethAmount += amountToAdd;
        }
        return ethAmount;
    }

    // 3. get amounts out ERC20 -> ERC20 [tested and works]
    function getAmountsOutMultipleTokensForMultipleTokensByPercent(
        address[] memory poolAddressesIn,
        uint256[] memory amountForEachTokensIn,
        address[] memory poolAddressesOut,
        uint256[] memory percentForEachTokenOut
    )
        public
        view
        checkArraysMatch(poolAddressesIn, amountForEachTokensIn)
        checkArraysMatch(poolAddressesOut, percentForEachTokenOut)
        returns (uint256[] memory)
    {
        uint256 ethAmountFromSwap = getAmountsOutMultipleTokensForEth(
            poolAddressesIn,
            amountForEachTokensIn
        );
        return
            getAmountsOutEthForMultipleTokensByPercent(
                ethAmountFromSwap,
                poolAddressesOut,
                percentForEachTokenOut
            );
    }

    // 4. get amounts out ERC20(s) -> ETH + ERC20(s) [tested and works]
    function getAmountsOutMultipleTokensForMultipleTokensAndEthByPercent(
        address[] memory _poolAddressesIn,
        uint256[] memory _amountForEachTokensIn,
        address[] memory _poolAddressesOut,
        uint256[] memory _percentForEachTokenOut
    )
        public
        view
        checkArraysMatch(_poolAddressesIn, _amountForEachTokensIn)
        checkArraysMatch(_poolAddressesOut, _percentForEachTokenOut)
        lastIndexOfAddressArrayMustBe0x0(_poolAddressesOut)
        returns (uint256[] memory)
    {
        uint256[] memory returnArray = new uint256[](_poolAddressesOut.length);
        address[]
            memory tempPoolAddressesOut = copyAddressArrayTillSecondLastIndex(
                _poolAddressesOut
            );
        uint256[]
            memory tempPercentForEachTokenOut = copyIntArrayTillSecondLastIndex(
                _percentForEachTokenOut,
                true
            );

        uint256 ethReceivedFromSwap = getAmountsOutMultipleTokensForEth(
            _poolAddressesIn,
            _amountForEachTokensIn
        );
        uint256 returnEthAmount = (ethReceivedFromSwap *
            _percentForEachTokenOut[_percentForEachTokenOut.length - 1]) /
            10000;
        uint256[]
            memory amountsOutEthForMultipleTokensByPercent = getAmountsOutEthForMultipleTokensByPercent(
                (ethReceivedFromSwap - returnEthAmount),
                tempPoolAddressesOut,
                tempPercentForEachTokenOut
            );
        for (
            uint256 i = 0;
            i < amountsOutEthForMultipleTokensByPercent.length;
            i++
        ) {
            returnArray[i] = amountsOutEthForMultipleTokensByPercent[i];
        }
        returnArray[returnArray.length - 1] = returnEthAmount;
        return returnArray;
    }

    // 5. get amounts out ERC20(s) + ETH -> ERC20(s) [tested and works]
    function getAmountsOutTokensAndEthForMultipleTokensByPercent(
        address[] memory _poolAddressesIn,
        uint256[] memory _amountForEachTokensIn,
        address[] memory _poolAddressesOut,
        uint256[] memory _percentForEachTokenOut
    )
        public
        view
        checkArraysMatch(_poolAddressesIn, _amountForEachTokensIn)
        checkArraysMatch(_poolAddressesOut, _percentForEachTokenOut)
        lastIndexOfAddressArrayMustBe0x0(_poolAddressesIn)
        returns (uint256[] memory)
    {
        // working on this portion
        uint256 userInputtedEthAmount = _amountForEachTokensIn[
            _amountForEachTokensIn.length - 1
        ];
        uint256[] memory returnArray = new uint256[](_poolAddressesOut.length);
        address[]
            memory tempPoolAddressesIn = copyAddressArrayTillSecondLastIndex(
                _poolAddressesIn
            );
        uint256[]
            memory tempPercentForEachTokenIn = copyIntArrayTillSecondLastIndex(
                _amountForEachTokensIn,
                false
            );

        uint256 ethReceivedFromSwap = getAmountsOutMultipleTokensForEth(
            tempPoolAddressesIn,
            tempPercentForEachTokenIn
        );

        uint256[]
            memory amountsOutEthForMultipleTokensByPercent = getAmountsOutEthForMultipleTokensByPercent(
                (ethReceivedFromSwap + userInputtedEthAmount),
                _poolAddressesOut,
                _percentForEachTokenOut
            );
        for (
            uint256 i = 0;
            i < amountsOutEthForMultipleTokensByPercent.length;
            i++
        ) {
            returnArray[i] = amountsOutEthForMultipleTokensByPercent[i];
        }
        return returnArray;
    }

    // Note: event emission is the one that displays the successful swap text on frontend
    // 1. ETH -> ERC20s [tested and works]
    function swapEthForMultipleTokensByPercent(
        address[] memory poolAddresses,
        uint256[] memory percentForEachToken
    ) public payable returns (uint256 ethAmount, SwapObject[] memory swapTo) {
        (ethAmount, swapTo) = internalSwapEthForMultipleTokensByPercent(
            ToAddress.Sender,
            0,
            poolAddresses,
            percentForEachToken
        );
        emit SwapEthForTokensEvent(ethAmount, swapTo);
    }

    // 2. ERC20s -> ETH [tested and works]
    function swapMultipleTokensForEth(
        address[] memory poolAddresses,
        uint256[] memory amountForEachTokens
    ) public returns (SwapObject[] memory swapFrom, uint256 ethAmount) {
        (swapFrom, ethAmount) = internalSwapMultipleTokensForEth(
            ToAddress.Sender,
            poolAddresses,
            amountForEachTokens
        );
        emit SwapTokensForEthEvent(swapFrom, ethAmount);
    }

    // 3. ERC20(s) -> ERC20(s) [tested and works] 
    function swapMultipleTokensForMultipleTokensByPercent(
        address[] memory poolAddressesIn,
        uint256[] memory amountForEachTokensIn,
        address[] memory poolAddressesOut,
        uint256[] memory percentForEachTokenOut
    )
        public
        returns (SwapObject[] memory swapFrom, SwapObject[] memory swapTo)
    {
        uint256 ethReceivedFromSwap;
        // swap ERC20s -> ETH and sends the ETH to this smart contract
        (swapFrom, ethReceivedFromSwap) = internalSwapMultipleTokensForEth(
            ToAddress.Contract,
            poolAddressesIn,
            amountForEachTokensIn
        );

        // swap ETH -> ERC20s and sends the ERC20 to the user
        (, swapTo) = internalSwapEthForMultipleTokensByPercent(
            ToAddress.Sender,
            ethReceivedFromSwap,
            poolAddressesOut,
            percentForEachTokenOut
        );
        emit SwapTokensForTokensEvent(swapFrom, swapTo);
    }

    // 4. ERC20(s) -> ETH + ERC20(s) [tested and works]
    function swapMultipleTokensForMultipleTokensAndEthByPercent(
        address[] memory _poolAddressesIn,
        uint256[] memory _amountForEachTokensIn,
        address[] memory _poolAddressesOut,
        uint256[] memory _percentForEachTokenOut
    )
        public
        lastIndexOfAddressArrayMustBe0x0(_poolAddressesOut)
        returns (SwapObject[] memory swapFrom, SwapObject[] memory swapTo)
    {
        /*
        For the front end, maybe we put 0x0 as the token address to represent native assets
        On the front end, when we get the the array of swap from and swap to,
        we should rearrange the array such that for swapTo (i.e. poolAddressesOut and percentForEachTokenOut),
        the native asset (e.g. ETH) that is represented by 0x0 should be at the last index.
        Meaning to say that that the simulated address and amount for ETH will be the last index in the 2
        arrays: poolAddressesOut and percentForEachTokenOut.
        Then, when we get the return values we rearrange it back to the original order and display on frontend
        */
        address[]
            memory tempPoolAddressesOut = copyAddressArrayTillSecondLastIndex(
                _poolAddressesOut
            );
        uint256[]
            memory tempPercentForEachTokenOut = copyIntArrayTillSecondLastIndex(
                _percentForEachTokenOut,
                true
            );

        uint256 ethReceivedFromSwap;
        (swapFrom, ethReceivedFromSwap) = internalSwapMultipleTokensForEth(
            ToAddress.Contract,
            _poolAddressesIn,
            _amountForEachTokensIn
        );
        uint256 returnEthAmount = (ethReceivedFromSwap *
            _percentForEachTokenOut[_percentForEachTokenOut.length - 1]) /
            10000;

        // Transfer eth back to sender
        (bool transferSuccess, ) = payable(msg.sender).call{value: returnEthAmount}("");
        require(transferSuccess, "ETH transfer failed");

        SwapObject[] memory swapToTemp;

        (, swapToTemp) = internalSwapEthForMultipleTokensByPercent(
            ToAddress.Sender,
            (ethReceivedFromSwap - returnEthAmount),
            tempPoolAddressesOut,
            tempPercentForEachTokenOut
        );
        // push the 'eth' simulation into swapTo object that will be return and emitted
        SwapObject memory swapObject = SwapObject(
            NATIVE_ADDRESS_SIMULATION,
            returnEthAmount
        );
        swapTo = copyAndPushToSwapObjectArray(swapToTemp, swapObject);
        emit SwapTokensForTokensAndEthEvent(swapFrom, swapTo);
    }

    // 5. ETH + ERC20 -> ERC20(s)
    function swapTokensAndEthForMultipleTokensByPercent(
        address[] memory _poolAddressesIn,
        uint256[] memory _amountForEachTokensIn,
        address[] memory _poolAddressesOut,
        uint256[] memory _percentForEachTokenOut
    )
        public
        payable
        lastIndexOfAddressArrayMustBe0x0(_poolAddressesIn)
        returns (SwapObject[] memory swapFrom, SwapObject[] memory swapTo)
    {
        /*
        Same concept as swapMultipleTokensForMultipleTokensAndEthByPercent,
        we place eth at the back and simulate it with 0x. Then ensure order on frontend is same as input on frontend        
        */
        uint256 userInputtedEthAmount = _amountForEachTokensIn[
            _amountForEachTokensIn.length - 1
        ];
        require(
            userInputtedEthAmount == msg.value,
            "Amount given must equal to the inputted ETH amount"
        );

        address[]
            memory tempPoolAddressesIn = copyAddressArrayTillSecondLastIndex(
                _poolAddressesIn
            );
        uint256[]
            memory tempPercentForEachTokenIn = copyIntArrayTillSecondLastIndex(
                _amountForEachTokensIn,
                false
            );

        uint256 ethReceivedFromSwap;
        SwapObject[] memory swapFromTemp;
        (swapFromTemp, ethReceivedFromSwap) = internalSwapMultipleTokensForEth(
            ToAddress.Contract,
            tempPoolAddressesIn,
            tempPercentForEachTokenIn
        );

        // push the 'eth' simulation into swapFrom object that will be return and emitted
        SwapObject memory swapObject = SwapObject(
            NATIVE_ADDRESS_SIMULATION,
            userInputtedEthAmount
        );
        swapFrom = copyAndPushToSwapObjectArray(swapFromTemp, swapObject);

        (, swapTo) = internalSwapEthForMultipleTokensByPercent(
            ToAddress.Sender,
            (ethReceivedFromSwap + userInputtedEthAmount),
            _poolAddressesOut,
            _percentForEachTokenOut
        );

        //
        emit SwapEthAndTokensForTokensEvent(swapFrom, swapTo);
    }

    function copyAndPushToSwapObjectArray(
        SwapObject[] memory _array,
        SwapObject memory swapObjectToPush
    ) internal pure returns (SwapObject[] memory) {
        require(_array.length > 0, "Array length must be greater than zero");
        SwapObject[] memory newArray = new SwapObject[](_array.length + 1);
        for (uint256 i = 0; i < _array.length; i++) {
            newArray[i] = _array[i];
        }
        newArray[_array.length] = swapObjectToPush;
        return newArray;
    }

    // [USDT, USDC, ETH] [1000, 3000, 6000] ; [i] * 10,000 / (sum of array less ETH)
    // -> 1000 * 10000/ (4000) = 2500 25%
    // -> 3000 * 10000/ (4000) = 7500 75%
    // will this ever cause decimal places?? Accoring to chatGPT it wont for the new method ;)
    // function copyIntArrayTillSecondLastIndex(
    //     uint256[] memory _array,
    //     bool rebalance
    // ) internal pure returns (uint256[] memory) {
    //     require(_array.length > 0, "Array length must be greater than zero");
    //     uint256 sumOfNewArray;
    //     uint256[] memory newArray = new uint256[](_array.length - 1);
    //     for (uint256 i = 0; i < newArray.length; i++) {
    //         newArray[i] = _array[i];
    //         sumOfNewArray += _array[i];
    //     }
    //     if (rebalance) {
    //         for (uint256 i = 0; i < newArray.length; i++) {
    //             newArray[i] = ((newArray[i] * 10000) / sumOfNewArray);
    //         }
    //     }

    //     return newArray;
    // }
    function copyIntArrayTillSecondLastIndex(
        uint256[] memory _array,
        bool rebalance
    ) internal pure returns (uint256[] memory) {
        require(_array.length > 0, "Array length must be greater than zero");
        uint256 sumOfNewArray;
        uint256[] memory newArray = new uint256[](_array.length - 1);
        for (uint256 i = 0; i < newArray.length; i++) {
            newArray[i] = _array[i];
            sumOfNewArray += _array[i];
        }
        if (rebalance) {
            for (uint256 i = 0; i < newArray.length; i++) {
                newArray[i] = ((newArray[i] * 10000) / sumOfNewArray);
            }

            uint256 adjustment = 0;
            uint256 sumOfNewArrayAfterRebalance = 0;
            for (uint256 i = 0; i < newArray.length; i++) {
                sumOfNewArrayAfterRebalance += newArray[i];
            }

            if (sumOfNewArrayAfterRebalance < 10000) {
                adjustment = 10000 - sumOfNewArrayAfterRebalance;
                uint256 adjustmentPerUnit = adjustment / newArray.length;
                for (uint256 i = 0; i < newArray.length; i++) {
                    newArray[i] += adjustmentPerUnit;
                }
            } else if (sumOfNewArrayAfterRebalance > 10000) {
                adjustment = sumOfNewArrayAfterRebalance - 10000;
                uint256 adjustmentPerUnit = adjustment / newArray.length;
                for (uint256 i = 0; i < newArray.length; i++) {
                    newArray[i] -= adjustmentPerUnit;
                }
            }
        }

        return newArray;
    }


    function copyAddressArrayTillSecondLastIndex(address[] memory _array)
        internal
        pure
        returns (address[] memory)
    {
        require(_array.length > 0, "Array length must be greater than zero");
        address[] memory newArray = new address[](_array.length - 1);
        for (uint256 i = 0; i < newArray.length; i++) {
            newArray[i] = _array[i];
        }
        return newArray;
    }

    modifier correctPercentageInput(uint256[] memory percentForEachToken) {
        uint256 amount;
        bool arrayContainsZero = false;
        for (uint256 i; i < percentForEachToken.length; i++) {
            amount += percentForEachToken[i];
            if (percentForEachToken[i] == 0) {
                arrayContainsZero = true;
            }
        }
        require(
            amount == 10000,
            "Error: percentage array doesn't add up to 100% or 10,000bps"
        );
        require(arrayContainsZero == false);
        _;
    }

    modifier checkArraysMatch(
        address[] memory poolAddresses,
        uint256[] memory percentForEachToken
    ) {
        require(
            poolAddresses.length == percentForEachToken.length,
            "Error: pool and percentage array doesn't match"
        );
        _;
    }

    modifier swapFromAmountsGreaterThanZero(
        uint256[] memory amountForEachTokens
    ) {
        bool allGreaterThanZero = true;
        for (uint256 i; i < amountForEachTokens.length; i++) {
            if (amountForEachTokens[i] <= 0) {
                allGreaterThanZero = false;
            }
        }
        require(allGreaterThanZero);
        _;
    }

    modifier lastIndexOfAddressArrayMustBe0x0(address[] memory poolAddresses) {
        require(
            poolAddresses[poolAddresses.length - 1] == NATIVE_ADDRESS_SIMULATION
        );
        _;
    }

    fallback() external payable {}

    receive() external payable {}
}
