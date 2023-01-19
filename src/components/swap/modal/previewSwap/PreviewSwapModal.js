import { Button, Modal, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import PreviewSwapItem from './PreviewSwapItem'
import { connect } from 'react-redux'

const PreviewSwapModal = ({ props, swapFrom, swapTo, multiswap, address }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [swapFromDetails, setSwapFromDetails] = useState()
  const [swapToDetails, setSwapToDetails] = useState()
  const [swapType, setSwapType] = useState('')
  const [swapIsLoading, setSwapisLoading] = useState(false)
  const [swapObject, setSwapObject] = useState({
    amount: [],
    poolAddresses: [],
    percentForEachToken: [],
  })

  const getAmountsOutDetails = async () => {
    let swapFromDetailsTemp = swapFrom.map((i) => ({
      amount: i.amount,
      symbol: i.symbol,
      price: i.price,
      decimals: i.decimals,
    }))
    let swapToDetailsTemp = swapTo.map((i) => ({
      amount: i.amount,
      symbol: i.symbol,
      price: i.price,
      decimals: i.decimals,
    }))

    // next time also need to consider which chain
    if (swapFrom.length == 1 && swapFrom[0].address === 'native') {
      // note: we change to string because thats usually how we call functions in the contract; check migrations file.
      const ethAmount = (swapFrom[0].amount * Math.pow(10, 18)).toString() //since amount needs to be in wei; i.e. 1x10^18
      // const ethAmount = '1000000000000000000' // 1ftm
      const poolAddresses = swapTo.map((i) => i.address)
      const percentForEachToken = swapTo.map((i) => (i.amount * 100).toString()) // *100 because in basis point i.e. 50% = 5000

      // note: best to use USDC and DAI for testing
      let amountsOut = await multiswap.methods
        .getAmountsOutEthForMultipleTokensByPercent(
          ethAmount,
          poolAddresses,
          percentForEachToken,
        )
        .call()
      console.log(amountsOut)
      for (let i in swapToDetailsTemp) {
        // divide by the 10^num of dp
        swapToDetailsTemp[i].amount =
          amountsOut[i] / Math.pow(10, swapToDetailsTemp[i].decimals)
      }
      console.log(swapFromDetailsTemp)
      console.log(swapToDetailsTemp)
      setSwapFromDetails(swapFromDetailsTemp)
      setSwapToDetails(swapToDetailsTemp)
      setSwapType('swapEthForMultipleTokensByPercent')
      setSwapObject({
        amount: [ethAmount],
        poolAddresses: poolAddresses,
        percentForEachToken: percentForEachToken,
      })
      setIsLoading(false)
    }
  }

  const initiateSwap = async () => {
    console.log('swap!')
    console.log(swapFromDetails)
    console.log(swapToDetails)
    setSwapisLoading(true)
    if (swapType === 'swapEthForMultipleTokensByPercent') {
      let callSwap = await multiswap.methods
        .swapEthForMultipleTokensByPercent(
          swapObject.poolAddresses,
          swapObject.percentForEachToken,
        )
        .send({
          from: address,
          value: swapObject.amount[0],
        })

      console.log(callSwap)
    }
    // else if(swapType === ...)...

    // uncomment this ltr when done
    // props.closePreviewAssetModal()
  }

  useEffect(() => {
    getAmountsOutDetails()
  }, [props.visible])

  return (
    <Modal
      title={'Preview Swap'}
      visible={props.visible}
      onCancel={props.closePreviewAssetModal}
      // allows us to edit the bottom component (i.e. the OK and Cancel)
      footer={null}
      bodyStyle={{ height: '60vh' }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div style={{ overflow: 'auto', height: '50vh' }}>
            <Row>You Give</Row>
            {swapFromDetails.map((i, index) => (
              <PreviewSwapItem
                amount={i.amount}
                symbol={i.symbol}
                price={i.price}
                key={`${index}previewSwapFrom`}
              />
            ))}
            <Row>You Get</Row>
            {!isLoading &&
              swapToDetails.map((i, index) => (
                <PreviewSwapItem
                  amount={i.amount}
                  symbol={i.symbol}
                  price={i.price}
                  key={`${index}previewSwapTo`}
                />
              ))}
          </div>
          <Button
            onClick={() => {
              initiateSwap()
            }}
          >
            Confirm
          </Button>
        </div>
      )}
    </Modal>
  )
}

const mapStateToProps = ({ swapReducer, connectWalletReducer }, ownProps) => ({
  swapFrom: swapReducer.swapFrom,
  swapTo: swapReducer.swapTo,
  props: ownProps,
  multiswap: connectWalletReducer.multiswap,
  address: connectWalletReducer.address,
})

export default connect(mapStateToProps)(PreviewSwapModal)

// import { Button, Modal, Row, Col } from 'antd'
// import { useEffect, useState } from 'react'
// import PreviewSwapItem from './PreviewSwapItem'
// import { connect } from 'react-redux'

// const PreviewSwapModal = ({ props, swapFrom, swapTo }) => {
//   const [isLoading, setIsLoading] = useState(true)
//   const [swapFromDetails, setSwapFromDetails] = useState()
//   const [swapToDetails, setSwapToDetails] = useState()

//   // change this eventually
//   const getAmountsOutDetails = async () => {
//     let swapFromDetailsTemp = swapFrom.map((i) => ({
//       amount: i.amount,
//       symbol: i.symbol,
//       price: i.price,
//     }))
//     let swapToDetailsTemp = swapTo.map((i) => ({
//       amount: i.amount,
//       symbol: i.symbol,
//       price: i.price,
//     }))
//     const callContractAndReplaceAmount = () => {
//       const amountFromContract = '10' // use the smart contract for this
//       // replaces the amount; much more code needed here
//       for (let i of swapToDetailsTemp) {
//         i.amount = amountFromContract
//       }
//       setSwapFromDetails(swapFromDetailsTemp)
//       setSwapToDetails(swapToDetailsTemp)
//       setIsLoading(false)
//     }
//     setTimeout(callContractAndReplaceAmount, 1500)
//   }

//   const initiateSwap = () => {
//     console.log('swap!')
//     console.log(swapFromDetails)
//     console.log(swapToDetails)
//   }

//   useEffect(() => {
//     getAmountsOutDetails()
//   }, [])
//   return (
//     <Modal
//       title={'Preview Swap'}
//       visible={props.visible}
//       onCancel={props.closePreviewAssetModal}
//       // allows us to edit the bottom component (i.e. the OK and Cancel)
//       footer={null}
//       bodyStyle={{ height: '60vh' }}
//     >
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <div>
//           <div style={{ overflow: 'auto', height: '50vh' }}>
//             <Row>You Give</Row>
//             {swapFromDetails.map((i, index) => (
//               <PreviewSwapItem
//                 amount={i.amount}
//                 symbol={i.symbol}
//                 price={i.price}
//                 key={`${index}previewSwapFrom`}
//               />
//             ))}
//             <Row>You Get</Row>
//             {!isLoading &&
//               swapToDetails.map((i, index) => (
//                 <PreviewSwapItem
//                   amount={i.amount}
//                   symbol={i.symbol}
//                   price={i.price}
//                   key={`${index}previewSwapTo`}
//                 />
//               ))}
//           </div>
//           <Button
//             onClick={() => {
//               initiateSwap()
//               props.closePreviewAssetModal()
//             }}
//           >
//             Confirm
//           </Button>
//         </div>
//       )}
//     </Modal>
//   )
// }

// const mapStateToProps = ({ swapReducer }, ownProps) => ({
//   swapFrom: swapReducer.swapFrom,
//   swapTo: swapReducer.swapTo,
//   props: ownProps,
// })

// export default connect(mapStateToProps)(PreviewSwapModal)
