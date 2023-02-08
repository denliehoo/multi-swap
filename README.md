# multi-swap

# Instructions:
For smart contract:

- to run the contract on a fork:
  - ganache-cli --fork NODEURLHERE
  - truffle migrate --reset
  - OR
  - truffle test

- to start frontend:
  - npm start

- Steps to run the application:
  1. Start up ganache-cli (if smart contract fork is to be deployed through truffle)
    - ganache-cli --fork NODEURLHERE
  2. Deploy the smart contract (if smart contract fork is to be deployed through truffle)
    - truffle migrate --reset
  3. Start the application (wait for the contract to deploy finish before starting)
    - npm start 

Note: ensure to change in connectWalletReducer if switching between deploy through truffle and remix


Note: if change chain, do it in connectWalletReducer and customTokenReducer

Note: can get free nodes here: https://www.quicknode.com/endpoints or https://infura.io/ or https://account.getblock.io/

Note: we can edit the block time to ensure transactions on our fork doesn't happen instantly. This makes it more realistic. We can do so by adding a -b flag along with the time in seconds (e.g. -b 20 would be 20 seconds). For example, we can do ganache-cli -b 20 --fork NODEURL HERE [Note: currently facing errors with this]

How to set up ganache-cli fork in metamask:
  - https://www.geeksforgeeks.org/how-to-set-up-ganche-with-metamask/
  1. Go to metamask and add network (Ensure that ganache cli is already running)
  2. Network name: Ganache , RPC URL: HTTP://127.0.0.1:8545 , Chain ID: 1337


Global dependencies required:
- npm i -g truffle ganache-cli

Environmental Values:
```Javascript
REACT_APP_MORALIS_API_KEY=XXXXX
```
# Product Road Map:
- Phase 1: Swap ETH for multiple token + Basic UI Done
- Phase 2: Swap multiple ETH/ERC20 tokens for ETH/ERC20 tokens
- Phase 3: Deploy to different EVM networks and allow for multiswap
- Phase 4: Continuous Improvements
  - Connect multiple routers to the smart contract and give the best rate for each token
  - Customisation of slippage

# Deployed contracts:
- Goerli: 0x743EaA47beaC140B1ff8d7b14C92A757A0dFAbF4
  - Multiswap: https://goerli.etherscan.io/address/0x743eaa47beac140b1ff8d7b14c92a757a0dfabf4#code
  - Uniswap Router V2: https://goerli.etherscan.io/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D#readContract
- Fantom: 0x4e604887d397BB75e064522223c0D56CDD92E990
  - Multiswap: https://ftmscan.com/address/0x4e604887d397BB75e064522223c0D56CDD92E990#code

---

https://medium.com/@saumya.ranjan/how-to-write-a-readme-md-file-markdown-file-20cb7cbcd6f

# Framework Explaination
- Antd is used to create multiple components
## Styling / CSS
- css modules are used
```Javascript
// multiple classes
className={`${classes.firstClass} ${classes.secondClass}`}

// classes with a "-" in the name
className={classes["form-control"]}
```
- colors used:
  - #86C232 lightGreen : text and borders
  - #61892F darkGreen : emphasis for text and borders e.g. on hover
  - #222629 blackish : background
  - #6B6E70 light grey :  misc
  - #474B4F dark grey : emphasis for misc e.g. on hover
  - transparent: background color for most components

# To do list / Progress:
## To do
<br />

- -----Start Of Phase 2: Swap ETH/ERC20 tokens to ETH/ERC20 tokens-----
- refactor code from Phase 1
- work on smart contract; possible scenario:
  1. ETH -> ERC20(s) coded previously
  2. ERC20(s) -> ERC20(s)
  3. ERC20(s) -> ETH + ERC20(s)
  4. ETH + ERC20 -> ERC20(s)
- write tests for it to ensure it works properly

- add approve button (for ERC20 tokens) to frontend
  - find out how to allow ERC20 tokens to be approved on frontend
    through metamask before swapping
- connect the new swap types to the frontend and ensure it is working

- -----End Of Phase 2: Swap ETH/ERC20 tokens to ETH/ERC20 tokens-----

<br />

- -----Start Of Phase 3: Ability to use different chains-----
- get the chain from the connected metamask and store it in the connectWalletReducer. Need ensure that the change chain in the nav bar works too
- changing the chains should cause the tokens/custom tokens displayed to change accordingly
- create similar smart contracts for other chains (e.g. ftm testnet / kovan)
- allow for multiple chains to be connected (e.g. ftm testnet/kovan) on the frontend
- hardcode common assets for the new chain
- ensure to seprate custom tokens for diff chains
- ensure swap functionalities are working
- -----End Of Phase 3: Ability to use different chains-----

<br />

- -----Start Of Phase 4: Continuous Improvements-----
- work on setting for swaps
  - e.g. slippage (need control on smartcontracts too)
- work on light mode dark mode css theme

## Pending Bug Fixes
- In CryptoSwapItem.js[ cant seem to recreate this issue. KIV]
  - if add 3 assets, if edit the 2nd one and then 3rd then 1st, gives errors. maybe check selectassetitem.js to fix
or, maybe upon clicking the + button, we create the asset in swapFrom and swapTo, but keep it with empty values except for index:
  - e.g. {index: 0, amount: 0, asset: "", ...} then, in selectassetitem, we change the details accordingly. 
  - This ensures that the list is ordered; but what about when remove assets? maybe we re-order? does the key for the cryptoswapitem change when remove to?
  - Solution is TBC

## Note / KIV: 
- In phase 1 release, have removed all the other assets from select asset modal in swap from except for the native asset (e.g. ETH or FTM) to ensure user doesn't select anything else from swap from
  - To revert the change, Search for the comment: // setCombinedAssetList(combinedAssetListTemp)
  - uncomment the that line
  - comment out the line below that

## Low Priority Items: 
- Optimisation/Reducing API Calls: find a way to cache/store the balances for a time period (e.g. 1 min) or when a swap is initiated on the platform. Meaning that instead of checking the API for balances directly, it should check the cache and the store it. Then, when opening the asset modal in another location, it should check if the time period (e.g. 1 min) is up OR if a swap is initiated on the platform. If that is the case, then check the API agian. Else, display the cached/stored information. 
- add swap history and save it to a database; history can access from nav bar
- Refactor backend to C# 
- Proxy set up for smart contract


# Done:
- 9/7/22: Code smart contract for ETH -> Multiple assets
- 2/9/22: General swap component structure
- 16/9/22: UI for Drop drop modal for select an asset (hardcode common assets) [pass state properly in the future]
- 18/9/22: UI Add custom token; do checks that it is a legit token address & fetch the token metadata (i.e. name) [https://docs.moralis.io/reference/gettokenmetadata]
- 20/9/22: Store custom addresses in local storage using redux persist
- 20/10/22: Find a way to pass state from the different components to the "swap" button in Swap.js
  - For now, just need to ensure that all the correct state is there for the swap and do a console.log() to test. Connect to smart contract in the future.
  - use redux and place in global state
  - e.g. maybe clicking swap maybe pass an object:
    ```Javascript
    const swapDetails = {
        from:[
            {asset: 'ETH', amount: 0.10 },{....}
        ],
        to:[
            {...},{...}
        ]
    }
    // note: array cause we want it to be iterable
    ```
- 20/10/22: Add percentage to each cryptoSwapItem (for to) and ensure sum of is always equal 100%
- 20/10/22: Validation for swap (ensure percentages sums to 100%, tokens are selected and amounts are al zero)
- 20/10/22: Upon clicking "PREVIEW SWAP", show prview swap modal which shows approximately what the user gets
- 20/10/22: Add a minus button for each cryptoSwapItem
  - ensure that there is always at least 1 to and from
  - remove the state upon minus
- 11/01/23: Added metamask connect
  - use redux and store the wallet address in global store
- 12/01/23: Price API to display price and ensure it is in preview swap
  - Created an API folder
  - Refactored price API. Price API is now called in CryptoSwapItem.js CryptoSwapToItem.js
  - Price is then added as an object in the global store for swap reducer in swapFrom and swapTo
  - Price is then taken from the store and placed in the PreviewSwapModal
- 12/01/23: Refactor and combine CryptoSwapItem.js and CryptoSwapToItem.js into just CryptoSwapItem.js
- 13/01/23: Add events to smart contract (so that can detect when swap is pending and finished)
- 15/01/23: Refactor to add in ftm chain. Separate ETH network items for future use
  - Note: If want change back chain, do it in the connecWalletReducer.js (e.g. to change chain back to eth, just put chain: 'eth' instead of 'ftm')
- 16/01/23: Get User Balances in select a token modal and display in swap component; use an API for this [https://deep-index.moralis.io/api-docs/#/account/getTokenBalances] or [https://docs.moralis.io/reference/getwallettokenbalances]
  - get balance should be in the SelectAssetModal component which passes the balance around the other components
  - Update the swap button to ensure that balances is also sent
  - validation to ensure swapping amount is < balance
- 17/01/23: connect smart contract to frontend (start with ftm) (refer to: https://github.com/denliehoo/defi-staking-app/blob/main/src/components/App.js on how to connect)
- 17/01/23: change the function in PreviewSwapModal.js; need to display getAmountOut and connect the swap function properly, and to display how many ERC20/ETH can be received from the swap in the Modal
- 17/01/23 - 2: add decimal places in the defaultAsset and custom token, also add it into the swapFrom/swapTo. Then, format the amount out in PreviewSwapModal.js properly
- 17/01/23 - 2: Fix issue which caused the custom token to not appear when toggling for the first time (before fix had to close modal and open again for it to appear)
- 18/01/23: Add swap functionality to frontend; ensure swap ETH (single asset) for multiple assets % (e.g. USDC and DAI) is functional
- 19/01/23: touch up on preview swap modal skeleton code (it should show token logo too; hence pass the state to swapFrom and swapTo)
- 19/01/23 -2 : Add pending spinner after clicking confirm swap and change the pending spinner to a swap submitted modal (refer to wireframe) after user confirms on metamask
- 25/01/23: Add in Goerli network and change it to it for testing
- 25/01/23: Show notifications when swap is pending (after use clicked confirm on metamask) and when swap is completed
- 25/01/23: Refactor connect wallet function from navbar to connectWalletReducer
- 25/01/23: Change the Preview Swap Button to "Connect To Wallet" if not connected. Upon clicking it, it should connect to wallet. 
- 26/01/23: error handling for when unable to get amounts out (e.g. USDT for FTM)
- 01/02/23: Basic CSS styling for antd components done in framework.css
- 01/02/23: Basic styling for some global components in styles.css
- 01/02/23: Basic CSS for Swap component, Select Asset Modal, Manage Custom Token Modal
- 02/02/23: Basic CSS for preview swap modal
- 03/02/23: Search function for select asset modal
- 03/02/23 - 2: Refactor search function into a component to be used in Select asset modal
- 03/02/23 - 2: format numbers. (TBC: crypto=8dp , FIAT=2dp)
- 05/02/23: Get chain id and ensure use is connected to the correct chain. If it isn't, request they add that chain. Metamask should also popup for this when user clicks change or add chain
  - try: wallet_switchEthereumChain first with just the chain Id
  - it will give an error if the user doesnt have the chain id in their metamask
  - Then, in catch block, do: wallet_addEthereumChain to get the users to add the chain
- 06/02/23: ensure inline css is refactored to module (except for antd specific ones)
- 06/02/23: make error handling look nicer
- 08/02/23: Prepare to deply to live environment
- -----End Of Phase 1: Swap ETH to Multiple ERC20 tokens-----