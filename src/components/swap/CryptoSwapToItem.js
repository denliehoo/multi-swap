import classes from './CryptoSwapToItem.module.css'
import { Row, Col } from 'antd/lib/grid'
import SelectAssetModal from './modal/SelectAssetModal'
import { useState, useEffect } from 'react'
import { MinusCircleOutlined } from '@ant-design/icons'
import { getAssetPrice } from '../../api/api'
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
  const [percentInput, setPercentInput] = useState(props.percent)
  const [price, setPrice] = useState(0)
  const [priceIsLoading, setPriceIsLoading] = useState(true)
  const chain = 'ETH'

    useEffect(() => {
    setPercentInput(props.percent)
  }, [props.percent])

    useEffect(() => {
    console.log(props.asset)
    getPrice(chain)
  }, [props.asset])

  const changeAmountInputHandler = (e) => {
    const inputValue = parseInt(e.target.value)
    setPercentInput(inputValue)
    props.changeSwapToPercent(props.index, inputValue)

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

  const minusHandler = () => {
    let newSwapTo = [...swapTo]
    let index = props.index
    newSwapTo.splice(index, 1)
    for (let i = index; i < newSwapTo.length; i++) {
      newSwapTo[i].index -= 1
    }
    removeSwapTo(newSwapTo)
    setPercentInput(newSwapTo[index].amount)
    props.changePercentageFromMinus(props.index)
    props.assetHasBeenSelected()
  }

    const getPrice = async (chain) => {
    if (props.asset) {
      const price = await getAssetPrice(chain, props.asset,props.address)
      setPrice(price)
      setPriceIsLoading(false)
      console.log("price for asset swap to: ", price)
      if (props.type === 'to') {
        let newSwapTo = [...swapTo]
        newSwapTo[props.index].price = price
        addSwapTo(newSwapTo)
      }

    } else {
      console.log('empty asset!')
    }
  }



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
            passBalanceToParent={() => {}}
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
