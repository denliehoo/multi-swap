const Multiswap = artifacts.require('Multiswap');

module.exports = async function (deployer, network, accounts) {
  const userWalletAddress = accounts[0];
  // ftm spooky swap router
  const routerAddress = '0xF491e7B69E4244ad4002BC14e878a34207E38c29';

  // eth uniswap v2 router
  // const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

  await deployer.deploy(Multiswap, routerAddress);

  const instance = await Multiswap.deployed();
};

// const {daiABI} = require('../src/utils/testTokenABIs/ftm/daiABI')
// const {usdcABI} = require('../src/utils/testTokenABIs/ftm/usdcABI')
// const Web3 = require('web3');
// const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

// const uint256MaxAmount = '115792089237316195423570985008687907853269984665640564039457584007913129639935'

// const Multiswap = artifacts.require("Multiswap");

// module.exports = async function (deployer, network, accounts) {
//     const userWalletAddress = accounts[0]
//     // ftm spooky swap router
//     const routerAddress = '0xF491e7B69E4244ad4002BC14e878a34207E38c29'

//     // eth uniswap v2 router
//     // const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'

//     await deployer.deploy(Multiswap, routerAddress);

//     const instance = await Multiswap.deployed();
//     // usdc dai for ftm
//     const poolAddress = ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E']
//     const usdcContract = new web3.eth.Contract(usdcABI, poolAddress[0]);
//     const daiContract = new web3.eth.Contract(daiABI, poolAddress[1]);

//     // usdc dai for eth
//     // const poolAddress = ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0x6b175474e89094c44da98b954eedeac495271d0f']

//     // uni for eth (gorli)
//     // const poolAddress = ['0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984']

//     const percentForEachToken = ['5000', '5000']

//     // 2 ftm value
//     const nativeAmount = '2000000000000000000' // 1992007988649074277 -> essentially lost 0.4% in fees

//     // 1 eth value
//     // const nativeAmount = '1000000000000000000'

//     // getting the amounts out
//     const getAmountsOut = await instance.getAmountsOutEthForMultipleTokensByPercent(nativeAmount, poolAddress, percentForEachToken)
//     console.log('From amounts out')
//     console.log(`USDC from getAmountsOut: ${getAmountsOut[0]}`)
//     console.log(`DAI from getAmountsOut: ${getAmountsOut[1]}`)

//     // swaping eth for erc20s
//     console.log('swaping ETH for ERC20s')
//     const receipt = await instance.swapEthForMultipleTokensByPercent(poolAddress, percentForEachToken, { value: nativeAmount })
//     console.log('return values from event')
//     const getEventReturnValuesFromReceipt = (receipt, eventName) => {
//         const logs = receipt.receipt.logs
//         for (let i = 0; i < logs.length; i++) {
//             const log = logs[i];
//             if (log.event === eventName) {
//             return log.args
//             }
//         }
//         return false
//     }
//     let returnValues = getEventReturnValuesFromReceipt(receipt, 'SwapEthForTokensEvent')
//     console.log(returnValues.swapFromAmount)
//     console.log(returnValues.swapTo)

//     // swap from eth to ERC
//     const amountForEachTokens = [returnValues.swapTo[0][1], returnValues.swapTo[1][1]]

//     // approve the token here ....
//     console.log("approving the token...")
//     // approving instance.address which is this smart contract address to spend the max amount. Transaction sent from user wallet address
//     await usdcContract.methods.approve(instance.address, uint256MaxAmount).send({ from: userWalletAddress });
//     await daiContract.methods.approve(instance.address, uint256MaxAmount).send({ from: userWalletAddress });
//     console.log('tokens approved')

//     // checking the allowance
//     console.log('checking the allowance. The allowances are:')
//     for(let i in poolAddress){
//         const allowance = await instance.allowanceERC20(poolAddress[i])

//         console.log(allowance.toString())
//     }

//     console.log('Swapping erc20s for eth')
//     const receipt2 = await instance.swapMultipleTokensForEth(poolAddress, amountForEachTokens)
//     returnValues = getEventReturnValuesFromReceipt(receipt2, 'SwapTokensForEthEvent')

//     console.log(`ethAmount from swap: ${returnValues.swapToAmount.toString()}`)

// };
