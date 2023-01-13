const Multiswap = artifacts.require("Multiswap");

module.exports = async function (deployer) {
    // ftm spooky swap router
    const routerAddress = '0xF491e7B69E4244ad4002BC14e878a34207E38c29'

    // eth uniswap v2 router
    // const routerAddress = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'


    await deployer.deploy(Multiswap, routerAddress);

    const instance = await Multiswap.deployed();
    // usdc dai for ftm
    const poolAddress = ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E']

    // usdc dai for eth
    // const poolAddress = ['0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', '0x6b175474e89094c44da98b954eedeac495271d0f']

    // uni for eth (gorli)
    // const poolAddress = ['0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984']


    const percentForEachToken = ['5000', '5000']

    // 20 ftm value
    const nativeAmount = '20000000000000000000'

    // 1 eth value
    // const nativeAmount = '1000000000000000000'

    // getting the amounts out
    const getAmountsOut = await instance.getAmountsOutEthForMultipleTokensByPercent(nativeAmount, poolAddress, percentForEachToken)
    console.log(`USDC from getAmountsOut: ${getAmountsOut[0]}`)
    console.log(`DAI from getAmountsOut: ${getAmountsOut[1]}`)

    // Watch for the event
    //..... code here

    // the swap
    const receipt = await instance.swapEthForMultipleTokensByPercent(poolAddress, percentForEachToken, { value: nativeAmount })
    const amounts = await instance.getAmountsArray()
    console.log(amounts)
    console.log(`USDC from swap: ${amounts[0]}`)
    console.log(`DAI from swap: ${amounts[1]}`)

};
