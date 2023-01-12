import classes from './Swap.module.css'
import { Row, Col } from 'antd/lib/grid'
import { Button } from 'antd'
import {
  DownCircleOutlined,
  PlusCircleOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { useEffect, useState } from 'react'
import CryptoSwapItem from './CryptoSwapItem'
import CryptoSwapToItem from './CryptoSwapToItem'
import PreviewSwapModal from './modal/previewSwap/PreviewSwapModal'

import { connect } from 'react-redux'
import {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
} from '../../reducers/swapReducer'

// Swap > CryptoSwapItem > SelectAssetModal > SelectAssetItem

const Swap = ({
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
  swapFrom,
  swapTo,
}) => {
  const [swapToPercentages, setSwapToPercentages] = useState([100])

  const [showPercentageError, setShowPercentageError] = useState(false)
  const [showTokenNotSelectedError, setShowTokenNotSelectedError] = useState(
    false,
  )
  const [showAmountError, setShowAmountError] = useState(false)
  const [toggleAssetSelected, setToggleAssetSelected] = useState(true)
  const [showPreviewSwapModal, setShowPreviewSwapModal] = useState(false)

  const percentageError = (
    <div>
      Please ensure that percentages add up to 100% and that none of the items
      are 0%
    </div>
  )

  const tokenNotSelectedError = (
    <div>Please ensure to select a token before swapping</div>
  )

  const amountError = <div>Please ensure amount from is more than zero</div>

  const changeSwapToPercentHandler = (i, percent) => {
    let newSwapToPercentages = [...swapToPercentages]
    newSwapToPercentages[i] = percent
    setSwapToPercentages(newSwapToPercentages)
    if (showPercentageError) {
      setShowPercentageError(false)
    }
  }

  // in basis points; i.e. 10,000 = 100% ; 5000 = 50%, etc...

  const validatePercentageArray = () => {
    const arrayHasZero = swapToPercentages.includes(0)
    const sumOfArray = swapToPercentages.reduce(
      (partialSum, a) => partialSum + a,
      0,
    )
    const valid = arrayHasZero || sumOfArray != 100 ? false : true
    if (!valid) {
      setShowPercentageError(true)
    }
    return valid
  }

  const validateTokenSelected = () => {
    const swapToSymbols = swapTo.map((i) => i.symbol)
    const swapFromSymbols = swapFrom.map((i) => i.symbol)
    const valid =
      swapToSymbols.includes('') || swapFromSymbols.includes('') ? false : true
    if (!valid) {
      setShowTokenNotSelectedError(true)
    }
    return valid
  }

  const validateAmount = () => {
    const swapFromAmount = swapFrom.map((i) => i.amount)
    const valid = swapFromAmount.includes(0) ? false : true
    if (!valid) {
      setShowAmountError(true)
    }
    return valid
  }

  const validateAmountLesserThanBalance = () => {
    const swapFromAmount = swapFrom.map((i) => i.amount)
    const swapFromBalance = swapFrom.map((i) => i.balance)
    let valid = true
    for (let i in swapFrom.length) {
      if (swapFromAmount[i] > swapFromBalance) {
        valid = false
        // error message
        break
      }
    }
    return valid
  }

  const toggleAssetSelectedState = () => {
    setToggleAssetSelected(!toggleAssetSelected)
  }

  const amountHasChanged = () => {
    setShowAmountError(false)
  }

  const changePercentageFromMinus = (index) => {
    let newSwapToPercentage = [...swapToPercentages]
    newSwapToPercentage.splice(index, 1)
    setSwapToPercentages(newSwapToPercentage)
  }

  const addSwapState = (type, index, newAssetDetails) => {
    if (type === 'from') {
      if (!swapFrom[index]) {
        let newSwapFrom = [...swapFrom]
        newSwapFrom.push(newAssetDetails)
        addSwapFrom(newSwapFrom)
      }
    } else if (type === 'to') {
      if (!swapTo[index]) {
        let newSwapTo = [...swapTo]
        newSwapTo.push(newAssetDetails)
        addSwapTo(newSwapTo)
      }
    }
  }
  //

  useEffect(() => {
    if (showTokenNotSelectedError) {
      setShowTokenNotSelectedError(false)
    }
  }, [toggleAssetSelected])

  return (
    // follow uniswap style for swap component
    <div className={classes.container}>
      <div className={classes.card}>
        <Row justify="space-between" style={{ width: '100%' }}>
          <Col>Swap</Col>
          <Col>Settings</Col>
        </Row>

        <Row>You Give</Row>
        <div className={classes.buySellContainer}>
          {swapFrom.map((i, index) => (
            <CryptoSwapItem
              amount={i.amount}
              key={`fromAsset${index}`}
              index={index}
              type={'from'}
              assetHasBeenSelected={toggleAssetSelectedState}
              amountHasChanged={amountHasChanged}
              asset={i.symbol}
              address={i.address}
            />
          ))}
          <Row
            justify="center"
            align="middle"
            style={{ position: 'relative', top: '5px' }}
          >
            <Button
              block
              shape="round"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                // setFromAssets([...fromAssets, { amount: 0 }])
                addSwapState('from', swapFrom.length, {
                  index: swapFrom.length,
                  symbol: '',
                  address: '',
                  balance: 0,
                  amount: '',
                })
              }}
            />
          </Row>
        </div>
        <div style={{ margin: '5px' }}>
          <DownCircleOutlined style={{ fontSize: '200%' }} />
        </div>
        {/* Swap to portion */}
        <Row>You Get</Row>
        <div className={classes.buySellContainer}>
          {swapTo.map((i, index) => (
            <CryptoSwapToItem
              percent={i.amount}
              key={`toAssets${index}`}
              index={index}
              type={'to'}
              changeSwapToPercent={changeSwapToPercentHandler}
              assetHasBeenSelected={toggleAssetSelectedState}
              asset={i.symbol}
              changePercentageFromMinus={changePercentageFromMinus}
              address={i.address}
            />
          ))}

          <Row
            justify="center"
            align="middle"
            style={{ position: 'relative', top: '5px' }}
          >
            <Button
              block
              shape="round"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                addSwapState('to', swapTo.length, {
                  index: swapTo.length,
                  symbol: '',
                  address: '',
                  balance: 0,
                  amount: 100,
                })
                let newSwapToPercentages = [...swapToPercentages]
                newSwapToPercentages.push(100)
                setSwapToPercentages(newSwapToPercentages)
              }}
            />
          </Row>
        </div>

        <div>
          {showAmountError ? amountError : ''}
          {showPercentageError ? percentageError : ''}
          {showTokenNotSelectedError ? tokenNotSelectedError : ''}
        </div>

        <Row style={{ width: '100%' }}>
          <Button
            size="large"
            block
            shape="round"
            onClick={() => {
              console.log(swapToPercentages)
              console.log(swapFrom)
              console.log(swapTo)
              const validPercentages = validatePercentageArray()
              const tokensSelected = validateTokenSelected()
              const validAmount = validateAmount()
              const amountLesserThanBalance = validateAmountLesserThanBalance()
              if (
                validPercentages &&
                tokensSelected &&
                validAmount &&
                amountLesserThanBalance
              ) {
                setShowPreviewSwapModal(true)
              }
            }}
          >
            Preview Swap
          </Button>
        </Row>
      </div>
      {showPreviewSwapModal ? (
        <PreviewSwapModal
          closePreviewAssetModal={() => {
            setShowPreviewSwapModal(false)
          }}
          visible={showPreviewSwapModal}
        />
      ) : (
        ''
      )}
    </div>
  )
}

const mapStateToProps = ({ swapReducer }) => ({
  swapFrom: swapReducer.swapFrom,
  swapTo: swapReducer.swapTo,
})

const mapDispatchToProps = (dispatch) => ({
  addSwapFrom: (payload) => dispatch(addSwapFrom(payload)),
  removeSwapFrom: (payload) => dispatch(removeSwapFrom(payload)),
  addSwapTo: (payload) => dispatch(addSwapTo(payload)),
  removeSwapTo: (payload) => dispatch(removeSwapTo(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Swap)
