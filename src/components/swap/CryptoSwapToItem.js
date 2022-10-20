import classes from './CryptoSwapToItem.module.css'
import { Row, Col } from 'antd/lib/grid'
import SelectAssetModal from './modal/SelectAssetModal'
import { useState, useEffect } from 'react'
import { MinusCircleOutlined } from '@ant-design/icons'

import { connect } from 'react-redux'
import {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
} from '../../reducers/swapReducer'

const CryptoSwapToItem = ({
  props,
  addSwapFrom,
  addSwapTo,
  swapFrom,
  swapTo,
  removeSwapTo,
}) => {
  const [balance, setBalance] = useState('')
  const [assetIsChosen, setAssetIsChosen] = useState(false)
  // const [amount, setAmount] = useState(100)
  const [percentInput, setPercentInput] = useState(props.percent)

  const getBalanceFromChild = (bal) => {
    setBalance(bal)
    setAssetIsChosen(true)
  }

  const changeAmountInputHandler = (e) => {
    const inputValue = parseInt(e.target.value)
    setPercentInput(inputValue)
    props.changeSwapToPercent(props.index, inputValue)

    if (assetIsChosen) {
      if (props.type === 'from') {
        let newSwapFrom = [...swapFrom]
        newSwapFrom[props.index].amount = inputValue
        addSwapFrom(newSwapFrom)
      } else if (props.type === 'to') {
        let newSwapTo = [...swapTo]
        newSwapTo[props.index].amount = inputValue
        addSwapTo(newSwapTo)
      }
    }
  }

  const minusHandler = () => {
    let newSwapTo = [...swapTo]
    let index = props.index
    newSwapTo.splice(index, 1)
    for (let i = index; i < newSwapTo.length; i++) {
      newSwapTo[i].index -= 1
    }
    console.log(newSwapTo)
    removeSwapTo(newSwapTo)
    props.assetHasBeenSelected()
    props.changePercentageFromMinus(props.index)
    setPercentInput(newSwapTo[index].amount)
  }

  useEffect(() => {
    setPercentInput(props.percent)
  }, [])

  return (
    <div className={classes.cryptoSwapItem}>
      <Row justify="space-between">
        <Col>Percentage To Receive</Col>
        <Col>
          {swapTo.length > 1 && (
            <MinusCircleOutlined
              className={classes.minus}
              onClick={minusHandler}
            />
          )}
        </Col>
      </Row>
      <Row justify="space-between" align="middle">
        {/* push amount to store somehow; also do validation to ensure amount less than balance. can do this in the swap button in Swap.js*/}
        {/* <Col style={{ fontSize: '2em' }}>{props.amount}</Col> */}
        <Col style={{ fontSize: '2em' }}>
          <span>
            <input
              className={classes.inputBox}
              onChange={changeAmountInputHandler}
              placeholder={0}
              value={percentInput}
              type={'number'}
              min={'0'}
              max={'100'}
            />
            %
          </span>
        </Col>
        <Col>
          <SelectAssetModal
            index={props.index}
            type={props.type}
            amount={percentInput}
            passBalanceToParent={getBalanceFromChild}
            assetHasBeenSelected={props.assetHasBeenSelected}
            asset={props.asset}
          />
        </Col>
      </Row>
      <Row>
        <input
          type="range"
          id="points"
          name="points"
          min="0"
          max="100"
          step="5"
          value={percentInput}
          onChange={changeAmountInputHandler}
        />
      </Row>
    </div>
  )
}

const mapStateToProps = ({ swapReducer }, ownProps) => ({
  swapFrom: swapReducer.swapFrom,
  swapTo: swapReducer.swapTo,
  props: ownProps,
})

const mapDispatchToProps = (dispatch) => ({
  addSwapFrom: (payload) => dispatch(addSwapFrom(payload)),
  removeSwapFrom: (payload) => dispatch(removeSwapFrom(payload)),
  addSwapTo: (payload) => dispatch(addSwapTo(payload)),
  removeSwapTo: (payload) => dispatch(removeSwapTo(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(CryptoSwapToItem)
