# multi-swap

# Instructions:

for smart contract:

- to run the contract on a fork:

  - ganache-cli --fork NODEURLHERE
  - truffle migrate --reset
  - OR
  - truffle test

- to start frontend:
- npm start

Roadmap:

- do swap by %
- do swap by specifying amount of token in the array
- do a proxy setup
- do multiple routers (and find the one which gives the best exchange)
- allow for customisation of slippage

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

- Add a minus button for each cryptoSwapItem
  - ensure that there is always at least 1 to and from
  - remove the state upon minus
- Price API to display price
- Balance API to display balance
  - validation to ensure swapping amount is balance
- Metamask connect
  - use redux and store the wallet address in global store
  - maybe use redux persist storage to ensure wallet address is not deleted
  - refactor custom token addresses into redux persist (maybe)
- Get User Balances in select a token modal and display in swap component; use an API for this [https://deep-index.moralis.io/api-docs/#/account/getTokenBalances][https://docs.moralis.io/reference/getwallettokenbalances]
  - get balance should be in the SelectAssetModal component which passes the balance around the other components
  - Update the swap button to ensure that balances in also sent
- Add getAmountOut function in smart contract to display how many ERC20/ETH can be receive from the swap
- connect smart contract to frontend (start with ropsten)
  - ensure swap ETH (single asset) for multiple assets (e.g. USDC and USDT) is functional
  - change the function in PreviewSwapModal.js; need to display getAmountOut and connect the swap function properly
- Add events to smart contract (so that can detect when swap is pending and finished)
  - Add pending spinner after swap and popup notification when swap is completed to frontend
- touch up on front end (css)
- refactor CSS code properly
- refactor any other code properly

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

- create similar smart contracts for other chains (e.g. ftm testnet / kovan)

- allow for multiple chains to be connected (e.g. ftm testnet/kovan) on the frontend
- hardcode common assets for the new chain
- allow for adding of custom tokens
  - ensure to seprate custom tokens for diff chains
- ensure swap functionalities are working

- work on setting for swaps
  - e.g. slippage (need control on smartcontracts too)
- work on light mode dark mode css theme

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
