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
  1. Start up ganache-cli
    - ganache-cli --fork NODEURLHERE
  2. Deploy the smart contract
    - truffle migrate --reset
  3. Start the application
    - npm start 

Note: can get free nodes here: https://www.quicknode.com/endpoints or https://infura.io/ or https://account.getblock.io/

How to set up ganache-cli fork in metamask:
  - https://www.geeksforgeeks.org/how-to-set-up-ganche-with-metamask/
  1. Go to metamask and add network (Ensure that ganache cli is already running)
  2. Network name: Ganache , RPC URL: HTTP://127.0.0.1:8545 , Chain ID: 1337

Desired Features:
- do swap by %
- do swap by specifying amount of token in the array
- do a proxy setup
- do multiple routers (and find the one which gives the best exchange)
- allow for customisation of slippage

Eventually: 
- refactor the API out. Use C# .NET as the backend to request for the API

Global dependencies required:
- npm i -g truffle ganache-cli

Environmental Values:
```Javascript
REACT_APP_MORALIS_API_KEY=XXXXX
```

---

https://medium.com/@saumya.ranjan/how-to-write-a-readme-md-file-markdown-file-20cb7cbcd6f

# To do list / Progress:

## To do
- add decimal places in the defaultAsset and custom token, also add it into the swapFrom/swapTo. Then, format the amount out in PreviewSwapModal.js properly
- Add pending spinner after swap and popup notification when swap is completed to frontend (use the events from the smart contract to know when swap is pending and done)
- ensure swap ETH (single asset) for multiple assets % (e.g. USDC and USDT) is functional
- touch up on front end (css)
- refactor CSS code properly
- refactor any other code properly
- deploy to live environment (both smart contract and frontend).
- -----End Of Phase 1: Swap ETH to Multiple ERC20 tokens-----

<br />

- -----Start Of Phase 2: Swap ETH/ERC20 tokens to ETH/ERC20 tokens-----
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
- In CryptoSwapItem.js
  - if add 3 assets, if edit the 2nd one and then 3rd then 1st, gives errors. maybe check selectassetitem.js to fix
or, maybe upon clicking the + button, we create the asset in swapFrom and swapTo, but keep it with empty values except for index:
  - e.g. {index: 0, amount: 0, asset: "", ...} then, in selectassetitem, we change the details accordingly. 
  - This ensures that the list is ordered; but what about when remove assets? maybe we re-order? does the key for the cryptoswapitem change when remove to?
  - Solution is TBC

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
