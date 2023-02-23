import classes from './PreviewSwapModal.module.css'
import { Button, Modal, Row, Col, notification } from 'antd'
import { useEffect, useState, useRef } from 'react'
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
import { getContractABI } from '../../../../api/api'

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
  const [swapObject, setSwapObject] = useState({})
  const [tokensRequiringApproval, setTokensRequiringApproval] = useState([])
  const [tokensApproved, setTokensApproved] = useState([])
  const [approvalRequiredBorder, setApprovalRequiredBorder] = useState(false)
  const [api, contextHolder] = notification.useNotification()
  const previewSwapModalContentRef = useRef(null)
  // in the future, refactor native_address uint2566, contract address
  // put it in a config folder and use it for the connectWallerReducer file too
  const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000'
  const WETH_ADDRESS = {
    goerli: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
    ftm: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  }
  const UINT_256_MAX_AMOUNT =
    '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  const MULTISWAP_ADDRESS = '0x6aD14F3770bb85a35706DCa781E003Fcf1e716e3'
  const openNotification = (message, placement) => {
    api.info({
      message: message,
      placement,
      icon: <ExclamationCircleOutlined />,
      // duration: 0
    })
  }

  const loadingSpinner = <LoadingOutlined style={{ fontSize: '128px' }} />

  const setSwapDetails = (
    swapFromDetails,
    swapToDetails,
    swapType,
    swapObject,
    tokensRequiringApproval,
  ) => {
    /* swapfrom and to details is only for display layout; hence it should be formatted to show the amount / 10^num
    of dps swapobject is that actual one sending to smart contract. Hence need take into account decimals */
    setSwapFromDetails(swapFromDetails)
    setSwapToDetails(swapToDetails)
    setSwapType(swapType)
    setSwapObject(swapObject)
    setModalContent('previewSwap')
    setTokensRequiringApproval(tokensRequiringApproval)
  }

  const reorderNativeToLast = (addresses, amounts) => {
    const indexToMove = addresses.indexOf(NATIVE_ADDRESS)
    const addressToMove = addresses.splice(indexToMove, 1)
    addresses.push(addressToMove[0])
    const amountToMove = amounts.splice(indexToMove, 1)
    amounts.push(amountToMove[0])
    return [addresses, amounts, indexToMove]
  }

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

    const poolAddressesIn = swapFrom.map((i) => i.address)
    const poolAddressesOut = swapTo.map((i) => i.address)
    // note: we change to string because thats usually how we call functions in the contract; check migrations file.
    const amountForEachTokensIn = swapFrom.map((i) =>
      (i.amount * Math.pow(10, i.decimals)).toString(),
    )
    console.log(amountForEachTokensIn)
    const percentForEachTokenOut = swapTo.map((i) =>
      (i.amount * 100).toString(),
    ) // *100 because in basis point i.e. 50% = 5000

    // next time also need to consider which chain
    // 1. ETH -> ERC20s
    try {
      if (
        swapFrom.length == 1 &&
        swapFrom[0].address === NATIVE_ADDRESS &&
        !poolAddressesOut.includes(NATIVE_ADDRESS)
      ) {
        console.log('case 1')
        const ethAmount = amountForEachTokensIn[0]

        // note: best to use USDC and DAI for testing
        let amountsOut = await multiswap.methods
          .getAmountsOutEthForMultipleTokensByPercent(
            ethAmount,
            poolAddressesOut,
            percentForEachTokenOut,
          )
          .call()
        for (let i in swapToDetailsTemp) {
          swapToDetailsTemp[i].amount =
            amountsOut[i] / Math.pow(10, swapToDetailsTemp[i].decimals)
        }
        setSwapDetails(
          swapFromDetailsTemp,
          swapToDetailsTemp,
          'swapEthForMultipleTokensByPercent',
          {
            amount: [ethAmount],
            poolAddresses: poolAddressesOut,
            percentForEachToken: percentForEachTokenOut,
          },
          [],
        )
      }
      // 2. ERC20(s) -> ETH
      else if (
        !poolAddressesIn.includes(NATIVE_ADDRESS) &&
        swapTo.length == 1 &&
        swapTo[0].address === NATIVE_ADDRESS
      ) {
        console.log('case 2!')
        let amountsOut = await multiswap.methods
          .getAmountsOutMultipleTokensForEth(
            poolAddressesIn,
            amountForEachTokensIn,
          )
          .call()

        swapToDetailsTemp[0].amount =
          amountsOut / Math.pow(10, swapToDetailsTemp[0].decimals)

        const tokensToApprove = await getTokensToApprove(
          poolAddressesIn,
          amountForEachTokensIn,
          swapFromDetailsTemp,
        )

        setSwapDetails(
          swapFromDetailsTemp,
          swapToDetailsTemp,
          'swapMultipleTokensForEth',
          {
            poolAddresses: poolAddressesIn,
            amountForEachTokens: amountForEachTokensIn,
          },
          tokensToApprove,
        )
      }
      // 3. ERC20(s) -> ERC20(s)
      else if (
        !poolAddressesIn.includes(NATIVE_ADDRESS) &&
        !poolAddressesOut.includes(NATIVE_ADDRESS)
      ) {
        console.log('case 3!')
        let amountsOut = await multiswap.methods
          .getAmountsOutMultipleTokensForMultipleTokensByPercent(
            poolAddressesIn,
            amountForEachTokensIn,
            poolAddressesOut,
            percentForEachTokenOut,
          )
          .call()

        for (let i in swapToDetailsTemp) {
          swapToDetailsTemp[i].amount =
            amountsOut[i] / Math.pow(10, swapToDetailsTemp[i].decimals)
        }

        const tokensToApprove = await getTokensToApprove(
          poolAddressesIn,
          amountForEachTokensIn,
          swapFromDetailsTemp,
        )

        setSwapDetails(
          swapFromDetailsTemp,
          swapToDetailsTemp,
          'swapMultipleTokensForMultipleTokensByPercent',
          {
            poolAddressesIn: poolAddressesIn,
            amountForEachTokensIn: amountForEachTokensIn,
            poolAddressesOut: poolAddressesOut,
            percentForEachTokenOut: percentForEachTokenOut,
          },
          tokensToApprove,
        )
      }
      // 4. ERC20(s) -> ETH + ERC20(s)
      else if (
        !poolAddressesIn.includes(NATIVE_ADDRESS) &&
        poolAddressesOut.includes(NATIVE_ADDRESS) &&
        !(
          poolAddressesIn.includes(WETH_ADDRESS[chain]) &&
          poolAddressesOut.includes(NATIVE_ADDRESS)
        )
      ) {
        console.log('case 4!')

        const [
          orderedPoolAddressesOut,
          orderedPercentForEachTokenOut,
          indexToMove,
        ] = reorderNativeToLast(poolAddressesOut, percentForEachTokenOut)

        let amountsOut = await multiswap.methods
          .getAmountsOutMultipleTokensForMultipleTokensAndEthByPercent(
            poolAddressesIn,
            amountForEachTokensIn,
            orderedPoolAddressesOut,
            orderedPercentForEachTokenOut,
          )
          .call()

        let orderedSwapToDetailsTemp = swapToDetailsTemp.map((i) => i)
        orderedSwapToDetailsTemp.push(
          ...orderedSwapToDetailsTemp.splice(indexToMove, 1),
        )

        for (let i in orderedSwapToDetailsTemp) {
          orderedSwapToDetailsTemp[i].amount =
            amountsOut[i] / Math.pow(10, orderedSwapToDetailsTemp[i].decimals)
        }

        const tokensToApprove = await getTokensToApprove(
          poolAddressesIn,
          amountForEachTokensIn,
          swapFromDetailsTemp,
        )

        setSwapDetails(
          swapFromDetailsTemp,
          orderedSwapToDetailsTemp,
          'swapMultipleTokensForMultipleTokensAndEthByPercent',
          {
            poolAddressesIn: poolAddressesIn,
            amountForEachTokensIn: amountForEachTokensIn,
            poolAddressesOut: orderedPoolAddressesOut,
            percentForEachTokenOut: orderedPercentForEachTokenOut,
          },
          tokensToApprove,
        )
      }
      // 5. ETH + ERC20 -> ERC20(s)
      else if (
        poolAddressesIn.includes(NATIVE_ADDRESS) &&
        !poolAddressesOut.includes(NATIVE_ADDRESS) &&
        !(
          poolAddressesIn.includes(NATIVE_ADDRESS) &&
          poolAddressesOut.includes(WETH_ADDRESS[chain])
        )
      ) {
        console.log('case 5!')

        const [
          orderedPoolAddressesIn,
          orderedAmountForEachTokensIn,
          indexToMove,
        ] = reorderNativeToLast(poolAddressesIn, amountForEachTokensIn)

        let amountsOut = await multiswap.methods
          .getAmountsOutTokensAndEthForMultipleTokensByPercent(
            orderedPoolAddressesIn,
            orderedAmountForEachTokensIn,
            poolAddressesOut,
            percentForEachTokenOut,
          )
          .call()

        for (let i in swapToDetailsTemp) {
          swapToDetailsTemp[i].amount =
            amountsOut[i] / Math.pow(10, swapToDetailsTemp[i].decimals)
        }

        let orderedSwapFromDetailsTemp = swapFromDetailsTemp.map((i) => i)
        orderedSwapFromDetailsTemp.push(
          ...orderedSwapFromDetailsTemp.splice(indexToMove, 1),
        )

        const tokensToApprove = await getTokensToApprove(
          poolAddressesIn.slice(0, -1),
          amountForEachTokensIn.slice(0, -1),
          orderedSwapFromDetailsTemp.slice(0, -1),
        )

        setSwapDetails(
          orderedSwapFromDetailsTemp,
          swapToDetailsTemp,
          'swapTokensAndEthForMultipleTokensByPercent',
          {
            poolAddressesIn: orderedPoolAddressesIn,
            amountForEachTokensIn: orderedAmountForEachTokensIn,
            poolAddressesOut: poolAddressesOut,
            percentForEachTokenOut: percentForEachTokenOut,
          },
          tokensToApprove,
        )
      }
      // if user tries swapping ETH with ETH or ETH -> WETH or WETH -> ETH
      else if (
        (poolAddressesIn.includes(NATIVE_ADDRESS) &&
          poolAddressesOut.includes(NATIVE_ADDRESS)) ||
        (poolAddressesIn.includes(WETH_ADDRESS[chain]) &&
          poolAddressesOut.includes(NATIVE_ADDRESS)) ||
        (poolAddressesIn.includes(NATIVE_ADDRESS) &&
          poolAddressesOut.includes(WETH_ADDRESS[chain]))
      ) {
        props.showNotificationInSwapJs(
          'Unable To Swap ETH for ETH or WETH, vice versa',
          'Try removing ETH or WETH in swap from or swap to',
          <ExclamationCircleOutlined />,
          'top',
        )
        closeModalHandler()
      }
      // eventually do the case for if swap two same tokens e.g. swapping usdt and usdt to ETH should reject
      // else if()
      else {
        console.log('something went wrong...')
        genericPreviewSapErrorAction()
      }
    } catch (e) {
      console.log(e)
      genericPreviewSapErrorAction()
    }
  }

  const genericPreviewSapErrorAction = () => {
    props.showNotificationInSwapJs(
      'Unable To Get Swap Details',
      'There seems to be an error in one of the tokens you are swapping to or from. Please swap to/from a different token',
      <ExclamationCircleOutlined />,
      'top',
    )
    closeModalHandler()
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
    setSwapFromDetails([])
    setSwapToDetails([])
    setSwapType('')
    setSwapObject({})
    setTokensRequiringApproval([])
    setTokensApproved([])
    setApprovalRequiredBorder(false)
    props.closePreviewAssetModal()
  }

  const approveAllTokensButtonHandler = () => {
    previewSwapModalContentRef.current.scrollTop = 0
    setApprovalRequiredBorder(true)
    const timer = setTimeout(() => {
      setApprovalRequiredBorder(false)
    }, 600)
    return () => clearTimeout(timer)
  }

  const getTokensToApprove = async (
    poolAddressesIn,
    amountForEachTokensIn,
    swapFromDetailsTemp,
  ) => {
    let tokensToApprove = []
    for (let i in poolAddressesIn) {
      const allowance = await multiswap.methods
        .allowanceERC20(poolAddressesIn[i])
        .call({ from: address })

      console.log('this is allowance for ', poolAddressesIn[i])
      console.log(allowance)

      if (amountForEachTokensIn[i] > allowance) {
        const tokenContractABI = await getContractABI(chain, poolAddressesIn[i])
        if (!tokenContractABI) {
          // throw an error here
          return
        }
        const tokenContract = new web3.eth.Contract(
          tokenContractABI,
          poolAddressesIn[i],
        )
        console.log(tokenContract)

        tokensToApprove.push({
          address: poolAddressesIn[i],
          symbol: swapFromDetailsTemp[i].symbol,
          contract: tokenContract,
          buttonIsLoading: false,
        })
      }
    }
    return tokensToApprove
  }

  const approveTokenHandler = async (i, index) => {
    console.log(tokensApproved)
    console.log(i.address)
    try {
      setTokensRequiringApproval((prevState) => {
        const newState = [...prevState]
        newState[index].buttonIsLoading = true
        return newState
      })

      const approved = await i.contract.methods
        .approve(MULTISWAP_ADDRESS, UINT_256_MAX_AMOUNT)
        .send({ from: address })
      if (approved.events.Approval.returnValues) {
        setTokensRequiringApproval((prevState) => {
          const newState = [...prevState]
          newState[index].buttonIsLoading = false
          return newState
        })
        setTokensApproved((prevState) => {
          const newState = [...prevState]
          newState.push(i.address)
          return newState
        })
      } else {
        console.log('Approved but something went wrong...')
      }
    } catch {
      openNotification('You have rejected the token approval', 'top')
      setTokensRequiringApproval((prevState) => {
        const newState = [...prevState]
        newState[index].buttonIsLoading = false
        return newState
      })
    }
  }

  useEffect(() => {
    props.visible && getAmountsOutDetails()
  }, [props.visible])

  return (
    <Modal
      title={modalContent === 'previewSwap' ? 'Preview Swap' : ''}
      visible={props.visible}
      onCancel={closeModalHandler}
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
          <div
            style={{ overflow: 'auto', height: '50vh' }}
            ref={previewSwapModalContentRef}
          >
            <span className="fw-700 color-light-grey">
              Note: This is only an estimation of what you'll receive
            </span>
            {tokensRequiringApproval.length > 0 && (
              <div
                className={`${classes.approveTokensContainer} ${
                  approvalRequiredBorder &&
                  classes.approveTokensContainerSelected
                }`}
              >
                <Row className="fw-700 mt-10 mb-10" justify="center">
                  Tokens Requiring Approval
                </Row>

                <Row
                  className={classes.approveTokensButtonContainer}
                  justify="center"
                >
                  {tokensRequiringApproval.map((i, index) =>
                    tokensApproved.includes(i.address) ? (
                      <div className={classes.tokenApproved}>
                        {<CheckCircleOutlined />} Approved {i.symbol}
                      </div>
                    ) : (
                      <div style={{ display: 'inline-block' }}>
                        <Button
                          type="primary"
                          onClick={() => approveTokenHandler(i, index)}
                          shape="round"
                          loading={i.buttonIsLoading}
                        >
                          Approve {i.symbol}
                        </Button>
                      </div>
                    ),
                  )}
                </Row>
              </div>
            )}
            <Row className="fw-700 mt-10">You Give</Row>
            {swapFromDetails.map((i, index) => (
              <PreviewSwapItem
                amount={i.amount}
                symbol={i.symbol}
                price={i.price}
                imgUrl={i.imgUrl}
                key={`${index}previewSwapFrom`}
              />
            ))}

            <Row className="fw-700 mt-10">You Get</Row>
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
          {
            <Button
              onClick={() => {
                tokensRequiringApproval.length !== tokensApproved.length
                  ? approveAllTokensButtonHandler()
                  : initiateSwap()
              }}
              type="primary"
              shape="round"
              block
            >
              {tokensRequiringApproval.length !== tokensApproved.length
                ? 'Approve All Tokens To Proceed'
                : 'Confirm'}
            </Button>
          }
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
                <div className="fw-700 mb-15">Waiting For Confirmation</div>
                <div className="mb-15">{getPendingSwapText()}</div>
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
                <div className="fw-700 mb-15">
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
