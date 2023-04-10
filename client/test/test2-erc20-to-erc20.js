// truffle test test/test2-erc20-to-erc20.js
const Multiswap = artifacts.require('Multiswap') // dont need specify where because of our configurations in truffle-config
const { daiABI } = require('../src/utils/testTokenABIs/ftm/daiABI')
const { usdcABI } = require('../src/utils/testTokenABIs/ftm/usdcABI')
const Web3 = require('web3')
const { assert } = require('chai')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const uint256MaxAmount =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
const routerAddress = '0xF491e7B69E4244ad4002BC14e878a34207E38c29'
// [USDC,DAI]
const poolAddressesIn = [
  '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
]
// [BOO,WBTC]
const poolAddressesOut = [
  '0x841fad6eae12c286d1fd18d1d525dffa75c7effe',
  '0x321162Cd933E2Be498Cd2267a90534A804051b11',
]

const usdcContract = new web3.eth.Contract(usdcABI, poolAddressesIn[0])
const daiContract = new web3.eth.Contract(daiABI, poolAddressesIn[1])

const percentForEachToken = ['5000', '5000']
// 2 ftm value
const nativeAmount = '2000000000000000000'

require('chai').use(require('chai-as-promised')).should()

const getEventReturnValuesFromReceipt = (receipt, eventName) => {
  const logs = receipt.receipt.logs
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i]
    if (log.event === eventName) {
      return log.args
    }
  }
  return false
}

// contract accepts 2 params
// first is the contract name
// second is an annonymous function. In this case, it accepts an annoymous function with the params accounts
contract(
  'Multiswap: Test case for 1. Swap ETH to ERC20 and 3. ERC20 to ERC20',
  (accounts) => {
    let instance, amountForEachTokensIn
    const userWalletAddress = accounts[0]

    // any code in the before function will run first before anything (can be placed anywhere)
    before(async () => {
      // Load contracts
      instance = await Multiswap.new(routerAddress) // new Tether instance
    })

    describe('Swap ETH for multiple', async () => {
      it('Get amounts out', async () => {
        const getAmountsOut = await instance.getAmountsOutEthForMultipleTokensByPercent(
          nativeAmount,
          poolAddressesIn,
          percentForEachToken,
        )
        console.log(`USDC from getAmountsOut: ${getAmountsOut[0]}`)
        console.log(`DAI from getAmountsOut: ${getAmountsOut[1]}`)
        assert.isAbove(parseInt(getAmountsOut[0]), 0)
        assert.isAbove(parseInt(getAmountsOut[1]), 0)
      })
      it('Swap should work', async () => {
        const receipt = await instance.swapEthForMultipleTokensByPercent(
          poolAddressesIn,
          percentForEachToken,
          { value: nativeAmount },
        )
        const returnValues = getEventReturnValuesFromReceipt(
          receipt,
          'SwapEthForTokensEvent',
        )
        console.log(`USDC from swap: ${returnValues.swapTo[0][1]}`)
        console.log(`DAI from swap: ${returnValues.swapTo[1][1]}`)
        amountForEachTokensIn = [
          returnValues.swapTo[0][1],
          returnValues.swapTo[1][1],
        ]
        assert.isAbove(parseInt(returnValues.swapTo[0][1]), 0)
        assert.isAbove(parseInt(returnValues.swapTo[1][1]), 0)
      })

      it('Tokens should approve', async () => {
        await usdcContract.methods
          .approve(instance.address, uint256MaxAmount)
          .send({ from: userWalletAddress })
        await daiContract.methods
          .approve(instance.address, uint256MaxAmount)
          .send({ from: userWalletAddress })
        for (let i in poolAddressesIn) {
          const allowance = await instance.allowanceERC20(poolAddressesIn[i])
          assert.equal(allowance.toString(), uint256MaxAmount)
        }
      })
    })

    describe('Check For Swap Multiple Tokens For Multiple Tokens', async () => {
      it('Get amounts out', async () => {
        const getAmountsOut = await instance.getAmountsOutMultipleTokensForMultipleTokensByPercent(
          poolAddressesIn,
          amountForEachTokensIn,
          poolAddressesOut,
          percentForEachToken,
        )
        console.log(`BOO from getAmountsOut: ${getAmountsOut[0]}`)
        console.log(`WBTC from getAmountsOut: ${getAmountsOut[1]}`)
        assert.isAbove(parseInt(getAmountsOut[0]), 0)
        assert.isAbove(parseInt(getAmountsOut[1]), 0)
      })
      it('Swap Should Work', async () => {
        const receipt2 = await instance.swapMultipleTokensForMultipleTokensByPercent(
          poolAddressesIn,
          amountForEachTokensIn,
          poolAddressesOut,
          percentForEachToken,
        )

        returnValues = getEventReturnValuesFromReceipt(
          receipt2,
          'SwapTokensForTokensEvent',
        )
        console.log(`BOO from swap: ${returnValues.swapTo[0][1]}`)
        console.log(`WBTC from swap: ${returnValues.swapTo[1][1]}`)
        assert.isAbove(parseInt(returnValues.swapTo[0][1]), 0)
        assert.isAbove(parseInt(returnValues.swapTo[1][1]), 0)
      })
    })
  },
)

/*
 WBTC: 21,658.13
 FTM: 0.4218
 BOO: 1.87

2 FTM
->
420355 USDC
420651429972686082 DAI
->
225566484359550566 BOO = (x/10^18)* 1.87 = 0.42180932575
1933 -> WBTC = (x/10^8)*21,658.13 = 0.4186516529

*/
