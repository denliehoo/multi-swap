import { Button, Modal, Row, Col, notification } from 'antd'
import { useEffect, useState } from 'react'
import PreviewSwapItem from './PreviewSwapItem'
import { connect } from 'react-redux'
import { ExclamationCircleOutlined, LoadingOutlined, SendOutlined } from '@ant-design/icons'

const PreviewSwapModal = ({ props, swapFrom, swapTo, multiswap, address }) => {
  const [modalContent, setModalContent] = useState('loading')
  const [swapFromDetails, setSwapFromDetails] = useState([])
  const [swapToDetails, setSwapToDetails] = useState([])
  const [swapType, setSwapType] = useState('')
  const [swapObject, setSwapObject] = useState({
    amount: [],
    poolAddresses: [],
    percentForEachToken: [],
  })
  const [api, contextHolder] = notification.useNotification()
  const openNotification = (placement) => {
    api.info({
      message: 'You have rejected the transaction',
      placement,
      icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
    })
  }

  const loadingSpinner = <LoadingOutlined style={{ fontSize: '128px' }} />

  const getAmountsOutDetails = async () => {
    let swapFromDetailsTemp = swapFrom.map((i) => ({
      amount: i.amount,
      symbol: i.symbol,
      price: i.price,
      decimals: i.decimals,
      imgUrl: i.imgUrl,
    }))
    let swapToDetailsTemp = swapTo.map((i) => ({
      amount: i.amount,
      symbol: i.symbol,
      price: i.price,
      decimals: i.decimals,
      imgUrl: i.imgUrl,
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
      setModalContent('previewSwap')
    }
  }

  const initiateSwap = async () => {
    console.log('swap!')
    console.log(swapFromDetails)
    console.log(swapToDetails)
    setModalContent('pendingConfirmation')
    try {
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

      setModalContent('swapSubmitted')
    } catch (e) {
      if (e?.code === 4001) {
        setModalContent('previewSwap')
        openNotification('top')
      }
    }
  }

  const getPendingSwapText = () => {
    const getIndividualSwapText = (arr) => {
      let returnString = ''
      if (arr.length > 1) {
        for (let i in arr) {
          if (arr.length - 1 === parseInt(i)) {
            returnString = returnString.substring(0, returnString.length - 2)
            returnString += ` and ${arr[i].amount} ${arr[i].symbol}`
          } else {
            returnString += `${arr[i].amount} ${arr[i].symbol}, `
          }
        }
      } else {
        returnString += `${arr[0].amount} ${arr[0].symbol}`
      }
      return returnString
    }

    return `Swapping ${getIndividualSwapText(
      swapFromDetails,
    )} for ${getIndividualSwapText(swapToDetails)}`
  }

  const closeModalHandler = () => {
    setModalContent('loading')
    props.closePreviewAssetModal()
  }

  useEffect(() => {
    props.visible && getAmountsOutDetails()
  }, [props.visible])

  return (
    <Modal
      title={modalContent === 'previewSwap' ? 'Preview Swap' : ''}
      visible={props.visible}
      onCancel={closeModalHandler}
      // allows us to edit the bottom component (i.e. the OK and Cancel)
      footer={null}
      bodyStyle={{ height: '60vh' }}
    >
      {contextHolder}
      {/* loading > preview swap > pending confirmation > swap submitted */}
      {/* Loading Spinner */}
      {modalContent === 'loading' && loadingSpinner}

      {/* Preview Swap */}
      {modalContent === 'previewSwap' && (
        <div>
          <div style={{ overflow: 'auto', height: '50vh' }}>
            <Row>You Give</Row>
            {swapFromDetails.map((i, index) => (
              <PreviewSwapItem
                amount={i.amount}
                symbol={i.symbol}
                price={i.price}
                imgUrl={i.imgUrl}
                key={`${index}previewSwapFrom`}
              />
            ))}
            <Row>You Get</Row>
            {swapToDetails.map((i, index) => (
              <PreviewSwapItem
                amount={i.amount}
                symbol={i.symbol}
                price={i.price}
                imgUrl={i.imgUrl}
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

      {/* Peding Confirmation */}
      {modalContent === 'pendingConfirmation' && (
        <div>
          {loadingSpinner}
          <div>Waiting For Confirmation</div>
          <div>{getPendingSwapText()}</div>
          <div>Confirm this transaction in your wallet</div>
        </div>
      )}

      {/* Swap Submitted */}
      {modalContent === 'swapSubmitted' && (
        <div>
          <SendOutlined style={{ fontSize: '128px' }} />
          <div>Your swap has been submitted!</div>
          <div>View on explorer</div>
          <Button onClick={closeModalHandler}>Close</Button>
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
