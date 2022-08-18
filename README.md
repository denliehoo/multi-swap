# multi-swap

Instructions:
for smart contract:
to run the contract on a fork:
ganache-cli --fork NODEURLHERE
truffle migrate --reset
OR
truffle test

Roadmap:
-do swap by %
-do swap by specifying amount of token in the array
-do a proxy setup
-do multiple routers (and find the one which gives the best exchange)
-allow for customisation of slippage

Global dependencies required:
npm i -g truffle ganache-cli 