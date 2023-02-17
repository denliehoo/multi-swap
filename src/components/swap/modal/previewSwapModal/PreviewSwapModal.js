import classes from "./PreviewSwapModal.module.css";
import { Button, Modal, Row, Col, notification } from 'antd'
import { useEffect, useState } from 'react'
import PreviewSwapItem from './PreviewSwapItem'
import { connect } from 'react-redux'
import {
  ExclamationCircleOutlined,
  LoadingOutlined,
  RightCircleOutlined,
  CheckCircleOutlined,
  ScanOutlined,
} from '@ant-design/icons'
import { formatNumber } from '../../../../utils/format/formatNumber'

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
      icon: <ExclamationCircleOutlined />,
      // duration: 0
    })
  }

  const loadingSpinner = <LoadingOutlined style={{ fontSize: '128px' }} />

  // possible to refactor this whole function out while still being able to call the state changing functions?
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
    // ETH -> ERC20s
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
        for (let i in swapToDetailsTemp) {
          // divide by the 10^num of dp
          swapToDetailsTemp[i].amount =
            amountsOut[i] / Math.pow(10, swapToDetailsTemp[i].decimals)
        }
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
        console.log(e)
        props.showNotificationInSwapJs(
          'Unable To Get Swap Details',
          'There seems to be an error in one of the tokens you are swapping to or from. Please swap to/from a different token',
          <ExclamationCircleOutlined />,
          'top',
        )
        closeModalHandler()
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
    // console.log(swapFromDetails)
    // console.log(swapToDetails)
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
            // console.log(`Transaction hash: ${hash}. user has confirmed`)
            props.showNotificationInSwapJs(
              'Transaction Pending',
              getPendingSwapText(),
              <LoadingOutlined />,
              'topRight',
              15,
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
          'topRight',
          15,
        )
        props.setSwapIsLoading(false)
        // in the future, show also push to history
        //
      }
      // else if(swapType === ...)...
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
      let swapToDetailsTemp = JSON.parse(JSON.stringify(swapTo)) // deep copy to ensure original doesn't change
      for (let i in swapToDetailsTemp) {
        swapToDetailsTemp[i].amount =
          parseInt(
            receipt.events.SwapEthForTokensEvent.returnValues.swapTo[i][1],
          ) / Math.pow(10, swapToDetailsTemp[i].decimals)
      }
      return (
        <span>
          {`You have successfully swapped ${formatNumber(
            swapFrom[0].amount,
            'crypto',
          )} ${swapFrom[0].symbol} for ${getIndividualSwapText(
            swapToDetailsTemp,
          )}`}{' '}
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
          returnString += ` and ${formatNumber(arr[i].amount, 'crypto')} ${
            arr[i].symbol
          }`
        } else {
          returnString += `${formatNumber(arr[i].amount, 'crypto')} ${
            arr[i].symbol
          }, `
        }
      }
    } else {
      returnString += `${formatNumber(arr[0].amount, 'crypto')} ${
        arr[0].symbol
      }`
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
      {modalContent === 'loading' && (
        <div className={classes.modalContentsContainer}>
          <Row
            align="middle"
            justify="center"
            style={{ width: '100%', height: '100%' }}
          >
            <Col>{loadingSpinner}</Col>
          </Row>
        </div>
      )}

      {/* Preview Swap */}
      {modalContent === 'previewSwap' && (
        <div className={classes.modalContentsContainer}>
          <div style={{ overflow: 'auto', height: '50vh' }}>
            <span className='fw-700 color-light-grey'>
              Note: This is only an estimation of what you'll receive
            </span>
            <Row className='fw-700 mt-10'>You Give</Row>
            {swapFromDetails.map((i, index) => (
              <PreviewSwapItem
                amount={i.amount}
                symbol={i.symbol}
                price={i.price}
                imgUrl={i.imgUrl}
                key={`${index}previewSwapFrom`}
              />
            ))}
            <Row className='fw-700 mt-10'>You Get</Row>
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
            type="primary"
            shape="round"
            block
          >
            Confirm
          </Button>
        </div>
      )}

      {/* Peding Confirmation */}
      {modalContent === 'pendingConfirmation' && (
        <div className={classes.modalContentsContainer}>
          <Row
            align="middle"
            justify="center"
            style={{ width: '100%', height: '100%', textAlign: 'center' }}
          >
            <Col>
              <Row align="middle" justify="center">
                {loadingSpinner}
              </Row>
              <Row align="middle" justify="center">
                <div className='fw-700 mb-15'>
                  Waiting For Confirmation
                </div>
                <div className='mb-15'>
                  {getPendingSwapText()}
                </div>
                <div>Confirm this transaction in your wallet</div>
              </Row>
            </Col>
          </Row>
        </div>
      )}

      {/* Swap Submitted */}
      {modalContent === 'swapSubmitted' && (
        <div className={classes.modalContentsContainer}>
          <Row
            align="middle"
            justify="center"
            style={{ width: '100%', height: '100%', textAlign: 'center' }}
          >
            <Col>
              <Row align="middle" justify="center">
                <RightCircleOutlined
                  style={{
                    fontSize: '128px',
                    fontWeight: 'normal',
                    padding: '10px',
                  }}
                />
              </Row>
              <Row align="middle" justify="center">
                <div className='fw-700 mb-15'>
                  Your swap has been submitted!
                </div>
                <Button
                  onClick={closeModalHandler}
                  type="primary"
                  shape="round"
                  block
                >
                  Close
                </Button>
              </Row>
            </Col>
          </Row>
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
