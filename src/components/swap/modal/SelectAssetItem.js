import classes from './SelectAssetItem.module.css'
import { Row, Col } from 'antd/lib/grid'
import { connect } from 'react-redux'
import {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
} from '../../../reducers/swapReducer'

const SelectAssetItem = ({
  props,
  addSwapFrom,
  addSwapTo,
  swapFrom,
  swapTo,
}) => {
  const addSwapHandler = (type, balance) => {
    console.log(props.amount)
    const newAssetDetails = {
      index: props.index,
      symbol: props.symbol,
      address: props.address,
      balance: balance,
      amount: props.amount,
    }
    if (type === 'from') {
      if (props.index == swapFrom[props.index].index) {
        let newSwapFrom = [...swapFrom]
        newSwapFrom[props.index] = newAssetDetails
        addSwapFrom(newSwapFrom)
      }
    } else if (type === 'to') {
      let newSwapTo = [...swapTo]
      if (props.index == swapTo[props.index].index) {
        newSwapTo[props.index] = newAssetDetails
        addSwapTo(newSwapTo)
      }
    }
  }

  return (
    <Row
      align="middle"
      justify="space-evenly"
      className={classes.selectAssetItemContainer}
      onClick={() => {
        addSwapHandler(props.type, props.balance)
        props.onClickHandler(props.symbol)
      }}
    >
      <Col span={2}>{props.icon}</Col>
      <Col span={18}>
        <Row>{props.name}</Row>
        <Row>
          {props.symbol}
          {props.isDefaultAsset ? (
            ''
          ) : (
            <span>
              {' '}
              &nbsp;:<em> Added by user</em>
            </span>
          )}
        </Row>
      </Col>
      <Col span={4}>
        <Row justify="end">{props.balance}</Row>
      </Col>
    </Row>
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectAssetItem)
