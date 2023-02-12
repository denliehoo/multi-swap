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
const poolAddresses = [
  '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
  '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E',
]

const usdcContract = new web3.eth.Contract(usdcABI, poolAddresses[0])
const daiContract = new web3.eth.Contract(daiABI, poolAddresses[1])

const percentForEachToken = ['5000', '5000']
// 2 ftm value
const nativeAmount = '2000000000000000000' // 1992007988649074277 -> essentially lost 0.4% in fees

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
contract('Multiswap: Test case for 1. Swap ETH to ERC20 and 2. ERC20 to ETH', (accounts) => {
  let instance, amountForEachTokens
  const userWalletAddress = accounts[0]

  // any code in the before function will run first before anything (can be placed anywhere)
  before(async () => {
    // Load contracts
    instance = await Multiswap.new(routerAddress) // new Tether instance
  })

  /*
    describe('TestNameHere', async () => {
        it('descriptionHere', async () => {
            // code here..
        })
        it('descriptionHere', async () => {
            // code here..
        })
    })
    */
  describe('Check Swap ETH for multiple', async () => {
    it('Get amounts out', async () => {
      const getAmountsOut = await instance.getAmountsOutEthForMultipleTokensByPercent(
        nativeAmount,
        poolAddresses,
        percentForEachToken,
      )
      console.log(`USDC from getAmountsOut: ${getAmountsOut[0]}`)
      console.log(`DAI from getAmountsOut: ${getAmountsOut[1]}`)
      assert.isAbove(parseInt(getAmountsOut[0]), 0)
      assert.isAbove(parseInt(getAmountsOut[1]), 0)
    })
    it('Swap should work', async () => {
      const receipt = await instance.swapEthForMultipleTokensByPercent(
        poolAddresses,
        percentForEachToken,
        { value: nativeAmount },
      )
      const returnValues = getEventReturnValuesFromReceipt(
        receipt,
        'SwapEthForTokensEvent',
      )
      console.log(`USDC from swap: ${returnValues.swapTo[0][1]}`)
      console.log(`DAI from swap: ${returnValues.swapTo[1][1]}`)
      amountForEachTokens = [
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
      for (let i in poolAddresses) {
        const allowance = await instance.allowanceERC20(poolAddresses[i])
        assert.equal(allowance.toString(), uint256MaxAmount)
      }
    })
  })

  describe('Check For Swap Eth For Multiple Tokens', async () => {
    it('Get amounts out', async () => {
      const getAmountsOut = await instance.getAmountsOutMultipleTokensForEth(
        poolAddresses,
        amountForEachTokens,
      )
      console.log(`ETH from getAmountsOut: ${getAmountsOut.toString()}`)
      assert.isAbove(parseInt(getAmountsOut), 0)
    })
    it('Swap Should Work', async () => {
      const receipt2 = await instance.swapMultipleTokensForEth(
        poolAddresses,
        amountForEachTokens,
      )

      const returnValues = getEventReturnValuesFromReceipt(
        receipt2,
        'SwapTokensForEthEvent',
      )
      console.log(
        `ethAmount from swap: ${returnValues.swapToAmount.toString()}`,
      )
      assert.isAbove(parseInt(returnValues.swapToAmount), 0)
    })
  })
})
