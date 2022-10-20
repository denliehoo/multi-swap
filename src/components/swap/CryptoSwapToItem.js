import classes from './CryptoSwapToItem.module.css'
import { Row, Col } from 'antd/lib/grid'
import SelectAssetModal from './modal/SelectAssetModal'
import { useState, useEffect } from 'react'

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
}) => {
  const [balance, setBalance] = useState('')
  const [assetIsChosen, setAssetIsChosen] = useState(false)
  // const [amount, setAmount] = useState(100)
  const [percentInput, setPercentInput] = useState(100)

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

  useEffect(() => {
    setPercentInput(props.percent)

    const newAssetDetails = {
      index: props.index,
      symbol: '',
      address: '',
      balance: 0,
      amount: 100,
    }

    if (props.type === 'from') {
      if (!swapFrom[props.index]) {
        let newSwapFrom = [...swapFrom]
        newSwapFrom.push(newAssetDetails)
        addSwapFrom(newSwapFrom)
      }
    } else if (props.type === 'to') {
      if (!swapTo[props.index]) {
        let newSwapTo = [...swapTo]
        newSwapTo.push(newAssetDetails)
        addSwapTo(newSwapTo)
      }
    }
  }, [])

  return (
    <div className={classes.cryptoSwapItem}>
      <Row>Input the percentage</Row>
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
              inputMode={'numeric'}
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

/*
Current problems:
- if add 3 assets, if edit the 2nd one and then 3rd then 1st, gives errors. maybe check selectassetitem.js to fix
or, maybe upon clicking the + button, we create the asset in swapFrom and swapTo, but keep it with empty values except for index:
e.g. {index: 0, amount: 0, asset: "", ...} then, in selectassetitem, we change the details accordingly. 
This ensures that the list is ordered; but what about when remove assets? maybe we re-order? does the key for the cryptoswapitem change when remove to?
TBC
*/
