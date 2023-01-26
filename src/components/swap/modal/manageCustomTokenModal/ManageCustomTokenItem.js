import classes from './ManageCustomTokenItem.module.css'
import { Row, Col } from 'antd'
import IconComponent from '../../shared/IconComponent'
import { DeleteOutlined, ScanOutlined } from '@ant-design/icons'

import { connect } from 'react-redux'
import { removeCustomToken } from '../../../../reducers/customTokenReducer'

const ManageCustomTokenItem = ({
  props,
  ethCustomTokens,
  ftmCustomTokens,
  goerliCustomTokens,
  removeCustomToken,
}) => {
  const getCustomTokens = (chain) => {
    if (chain === 'eth') {
      return ethCustomTokens
    } else if (chain === 'ftm') {
      return ftmCustomTokens
    } else if (chain == 'goerli') {
      return goerliCustomTokens
    }
  }
  const deleteHandler = () => {
    const customTokens = getCustomTokens(props.chain)
    const customTokenSymbols = customTokens.map((i) => i.symbol)
    const indexOfAsset = customTokenSymbols.indexOf(props.symbol)
    customTokens.splice(indexOfAsset, 1) // remove the entire {asset} from the customTokens array
    removeCustomToken(customTokens)
    // props.onClickDeleteHandler(customTokens)
    props.onClickDelete()
    props.setToggleChangesInCustomToken()

    // find the array index of the props.symbol -> remove this from the custom token array
    // -> call removeCustomToken and return the new array
  }

  const tokenContractWebsiteHandler = () => {
    if (props.chain == 'eth') {
      return (
        <a
          href={`https://etherscan.io/address/${props.address}`}
          target="_blank"
        >
          <ScanOutlined className={classes.icon} />
        </a>
      )
    } else if (props.chain == 'ftm') {
      return (
        <a
          href={`https://ftmscan.com/address/${props.address}`}
          target="_blank"
        >
          <ScanOutlined className={classes.icon} />
        </a>
      )
    } else if (props.chain == 'goerli') {
      return (
        <a
          href={`https://goerli.etherscan.io/address/${props.address}`}
          target="_blank"
        >
          <ScanOutlined className={classes.icon} />
        </a>
      )
    }
  }
  return (
    <Row
      align="middle"
      justify="space-evenly"
      className={classes.manageCustomTokenItemContainer}
    >
      <Col span={2}>
        <IconComponent imgUrl={props.icon} />
      </Col>
      <Col span={18}>
        <Row>
          {props.symbol} {props.name}
        </Row>
      </Col>
      <Col span={2}>
        <Row justify="end">
          <DeleteOutlined className={classes.icon} onClick={deleteHandler} />
        </Row>
      </Col>
      <Col span={2}>
        <Row justify="end">{tokenContractWebsiteHandler()}</Row>
      </Col>
    </Row>
  )
}

const mapStateToProps = ({ customTokenReducer }, ownProps) => ({
  ethCustomTokens: customTokenReducer.eth,
  ftmCustomTokens: customTokenReducer.ftm,
  goerliCustomTokens: customTokenReducer.goerli,
  props: ownProps,
})

const mapDispatchToProps = (dispatch) => ({
  removeCustomToken: (payload) => dispatch(removeCustomToken(payload)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ManageCustomTokenItem)

/*
Note: if a component have it's own props we also need to put ownProps as a 2nd param
in mapStateToProps. Then we define it as props and pass it through our component in the
object i.e. do this const Comp = ({ props, state, action1, action2 }) => {...

    NOTE: doing this is wrong X const Comp = (props,{state,action1,action2}) => {...

https://react-redux.js.org/api/connect#mapstatetoprops-state-ownprops--object
*/
