const Multiswap = artifacts.require("Multiswap");

module.exports = async function (deployer) {
    const routerAddress = '0xF491e7B69E4244ad4002BC14e878a34207E38c29'
    await deployer.deploy(Multiswap, routerAddress);

    const instance = await Multiswap.deployed();
    // usdc dai
    const poolAddress = ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E']
    const percentForEachToken = ['5000', '5000']
    // 20 ftm value
    const receipt = await instance.swapEthForMultipleTokensByPercent(poolAddress, percentForEachToken, { value: '20000000000000000000' }).call()
    const amounts = await instance.getAmountsArray()
    console.log(amounts)

    console.log(`USDC: ${amounts[0]}`)
    console.log(`DAI: ${amounts[1]}`)

};
