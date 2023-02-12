# multi-swap

# Instructions:
For smart contract:

- to run the contract on a fork:
  - ganache-cli --fork NODEURLHERE
  - truffle migrate --reset

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

- Testing of contract in truffle
  - tests are in the tests folder.
  - To Test all contracts, run this line in the terminal:
    - truffle test
    - Note: each test file in the test folder are independent of each other
  - We can also just test a single file by specifying the path to the file (truffle test PATH_TO_FILE/FILE.JS) e.g.:
    - truffle test test/THE_TEST_FILE_NAME.js
  - Note: truffle test doesn't actually deploy the contract. But will test execute the main_migration.js file
  - describe is the description of the test name;
  - it is the description of each of the test in the test; we can have multiple its in a describe
  - assert ensures that we get a certain result. If asset fails, then the test fails

- How to set up ganache-cli fork in metamask:
  - https://www.geeksforgeeks.org/how-to-set-up-ganche-with-metamask/
  1. Go to metamask and add network (Ensure that ganache cli is already running)
  2. Network name: Ganache , RPC URL: HTTP://127.0.0.1:8545 , Chain ID: 1337

- Global dependencies required:
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
Check TODOANDPROGRESS.md