import { Button, Modal, Row, Col, notification } from 'antd'
import { useEffect, useState } from 'react'
import PreviewSwapItem from './PreviewSwapItem'
import { connect } from 'react-redux'
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
  SendOutlined,
  CheckCircleOutlined,
  ScanOutlined,
} from '@ant-design/icons'

const PreviewSwapModal = ({
  props,
  swapFrom,
  swapTo,
  multiswap,
  address,
  chain,
  web3,
}) => {
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
  const openNotification = (message, placement) => {
    api.info({
      message: message,
      placement,
      icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
    })
  }

  const loadingSpinner = <LoadingOutlined style={{ fontSize: '128px' }} />
  console.log(modalContent)

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
      try {
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
      } catch (e) {
        //....
        console.log(e)
        console.log(
          'An error occured in one of the tokens you are trying to swap to/from',
        )
        setModalContent('unableToGetSwapDetails')
      }
    }
  }

  const getLinkToBlockExplorer = (hash) => {
    if (chain == 'eth') {
      return (
        <a href={`https://etherscan.io/tx/${hash}`} target="_blank">
          <ScanOutlined />
        </a>
      )
    } else if (chain == 'ftm') {
      return (
        <a href={`https://ftmscan.com/tx/${hash}`} target="_blank">
          <ScanOutlined />
        </a>
      )
    } else if (chain == 'goerli') {
      return (
        <a href={`https://goerli.etherscan.io/tx/${hash}`} target="_blank">
          <ScanOutlined />
        </a>
      )
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
          }) // only when user clicks confirm on metamask will this next step appear
          .on('transactionHash', (hash) => {
            console.log(`Transaction hash: ${hash}. user has confirmed`)
            props.showNotificationInSwapJs(
              'Transaction Pending',
              getPendingSwapText(),
              <LoadingOutlined />,
            )
            props.setSwapIsLoading(true)
            setModalContent('swapSubmitted')
          })
        // .on('receipt', (receipt) => {
        //   console.log(`Transaction confirmed: ${receipt}`);
        //   console.log(receipt)
        // });

        // Promise will resolve once the transaction has been confirmed and mined
        const receipt = await web3.eth.getTransactionReceipt(
          callSwap.transactionHash,
        )
        console.log(receipt)
        console.log(callSwap)
        props.showNotificationInSwapJs(
          'Transaction Completed',
          getSuccessfulSwapText(callSwap),
          <CheckCircleOutlined />,
        )
        props.setSwapIsLoading(false)
        // in the future, show also push to history
        //
      }
      // else if(swapType === ...)...

      // setModalContent('swapSubmitted')
    } catch (e) {
      if (e?.code === 4001) {
        setModalContent('previewSwap')
        openNotification('You have rejected the transaction', 'top')
      }
    }
  }

  const getPendingSwapText = () => {
    return `Swapping ${getIndividualSwapText(
      swapFromDetails,
    )} for ${getIndividualSwapText(swapToDetails)}`
  }

  const getSuccessfulSwapText = (receipt) => {
    if (swapType === 'swapEthForMultipleTokensByPercent') {
      let swapToDetailsTemp = JSON.parse(JSON.stringify(swapTo))
      for (let i in swapToDetailsTemp) {
        swapToDetailsTemp[i].amount =
          parseInt(
            receipt.events.SwapEthForTokensEvent.returnValues.swapTo[i][1],
          ) / Math.pow(10, swapToDetailsTemp[i].decimals)
      }
      return (
        <span>
          {`You have successfully swapped ${swapFrom[0].amount} ${
            swapFrom[0].symbol
          } for ${getIndividualSwapText(swapToDetailsTemp)}`}{' '}
          {getLinkToBlockExplorer(receipt.transactionHash)}
        </span>
      )
    }
  }

  const getIndividualSwapText = (arr) => {
    let returnString = ''
    if (arr.length > 1) {
      for (let i in arr) {
        if (arr.length - 1 === parseFloat(i)) {
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

  const closeModalHandler = () => {
    setModalContent('loading')
    props.closePreviewAssetModal()
  }

  useEffect(() => {
    props.visible && getAmountsOutDetails()
  }, [props.visible])

  return (
    <Modal
      // title={modalContent === 'previewSwap' ? 'Preview Swap' : ''}
      title={
        modalContent === 'previewSwap'
          ? 'Preview Swap'
          : modalContent === 'unableToGetSwapDetails'
          ? 'Unable To Get Swap Details'
          : ''
      }
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
      {/* Unable to get swap details */}
      {modalContent === 'unableToGetSwapDetails' && (
        <div>
          <div>
            There seems to be an error in one of the tokens you are swapping to
            or from. Please swap to/from a different token
          </div>
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
  web3: connectWalletReducer.web3,
  chain: connectWalletReducer.chain,
})

export default connect(mapStateToProps)(PreviewSwapModal)