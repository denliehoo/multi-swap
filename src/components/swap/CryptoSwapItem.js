import classes from './CryptoSwapItem.module.css'
import { Row, Col } from 'antd/lib/grid'
import SelectAssetModal from './modal/SelectAssetModal'
import { useState } from 'react'
import { MinusCircleOutlined } from '@ant-design/icons'

import { connect } from 'react-redux'
import {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
} from '../../reducers/swapReducer'

const CryptoSwapItem = ({
  props,
  addSwapFrom,
  addSwapTo,
  swapFrom,
  swapTo,
  removeSwapFrom,
}) => {
  const [balance, setBalance] = useState('')
  const [assetIsChosen, setAssetIsChosen] = useState(false)
  const [amount, setAmount] = useState(props.amount)

  const getBalanceFromChild = (bal) => {
    setBalance(bal)
    setAssetIsChosen(true)
  }

  const changeAmountInputHandler = (e) => {
    setAmount(e.target.value)
    props.amountHasChanged()
    if (assetIsChosen) {
      if (props.type === 'from') {
        let newSwapFrom = [...swapFrom]
        newSwapFrom[props.index].amount = e.target.value
        addSwapFrom(newSwapFrom)
      } else if (props.type === 'to') {
        let newSwapTo = [...swapTo]
        newSwapTo[props.index].amount = e.target.value
        addSwapTo(newSwapTo)
      }
    }
  }

  const minusHandler = () => {
    let newSwapFrom = [...swapFrom]
    let index = props.index
    newSwapFrom.splice(index, 1)
    for (let i = index; i < newSwapFrom.length; i++) {
      newSwapFrom[i].index -= 1
    }
    console.log(newSwapFrom)
    removeSwapFrom(newSwapFrom)
    setAmount(newSwapFrom[index].amount)
    props.assetHasBeenSelected()
  }

  return (
    <div className={classes.cryptoSwapItem}>
      <Row>Amount To Swap</Row>
      <Col>
        {swapFrom.length > 1 && (
          <MinusCircleOutlined
            className={classes.minus}
            onClick={minusHandler}
          />
        )}
      </Col>

      <Row justify="space-between" align="middle">
        {/* push amount to store somehow; also do validation to ensure amount less than balance. can do this in the swap button in Swap.js*/}
        {/* <Col style={{ fontSize: '2em' }}>{props.amount}</Col> */}
        <Col style={{ fontSize: '2em' }}>
          <input
            className={classes.inputBox}
            onChange={changeAmountInputHandler}
            value={amount}
            placeholder={'0.0'}
            type={'number'}
          />
        </Col>
        <Col>
          <SelectAssetModal
            index={props.index}
            type={props.type}
            amount={amount}
            passBalanceToParent={getBalanceFromChild}
            assetHasBeenSelected={props.assetHasBeenSelected}
            asset={props.asset}
          />
          {/* <Button>
                        Select an asset<DownOutlined />
                    </Button> */}
        </Col>
      </Row>
      <Row justify="space-between">
        {/* use an api to get the dollar value of an asset
                and then multiply it by amount */}
        <Col>${4000}</Col>

        <Col>Balanace: {balance}</Col>
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

export default connect(mapStateToProps, mapDispatchToProps)(CryptoSwapItem)

/*
Current problems:
- if add 3 assets, if edit the 2nd one and then 3rd then 1st, gives errors. maybe check selectassetitem.js to fix
or, maybe upon clicking the + button, we create the asset in swapFrom and swapTo, but keep it with empty values except for index:
e.g. {index: 0, amount: 0, asset: "", ...} then, in selectassetitem, we change the details accordingly. 
This ensures that the list is ordered; but what about when remove assets? maybe we re-order? does the key for the cryptoswapitem change when remove to?
TBC
*/
