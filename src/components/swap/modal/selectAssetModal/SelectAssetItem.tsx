import { useWindowSize } from "@src/hooks/useWindowSize";
import {
  ISwapDetails,
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
} from "@src/reducers/swap";
import { formatNumber } from "@src/utils/format/number";
import classes from "./SelectAssetItem.module.css";
import { Row, Col } from "antd/lib/grid";
import { connect } from "react-redux";
import { Dispatch } from "redux";

const SelectAssetItem = ({
  props,
  addSwapFrom,
  addSwapTo,
  swapFrom,
  swapTo,
}) => {
  const { width } = useWindowSize();
  const addSwapHandler = (type, balance) => {
    const newAssetDetails = {
      index: props.index,
      symbol: props.symbol,
      address: props.address,
      balance: balance,
      amount: props.amount,
      decimals: props.decimals,
      imgUrl: props.imgUrl,
    };
    if (type === "from") {
      // if they are the same index, we change the details
      if (props.index === swapFrom[props.index].index) {
        let newSwapFrom = [...swapFrom];
        newSwapFrom[props.index] = newAssetDetails;
        addSwapFrom(newSwapFrom);
      }
    } else if (type === "to") {
      let newSwapTo = [...swapTo];
      if (props.index === swapTo[props.index].index) {
        newSwapTo[props.index] = newAssetDetails;
        addSwapTo(newSwapTo);
      }
    }
  };

  return (
    <Row
      align="middle"
      justify="space-evenly"
      className={classes.selectAssetItemContainer}
      onClick={() => {
        addSwapHandler(props.type, props.balance);
        props.onClickHandler(props.symbol, props.balance);
      }}
    >
      <Col span={width && width > 460 ? 2 : width && width > 350 ? 3 : 4}>
        {props.icon}
      </Col>
      <Col span={width && width > 460 ? 18 : width && width > 350 ? 17 : 16}>
        <Row>{props.name}</Row>
        <Row>
          {props.symbol}
          {props.isDefaultAsset ? (
            ""
          ) : (
            <span>
              {" "}
              &nbsp;:<em> Added by user</em>
            </span>
          )}
        </Row>
      </Col>
      <Col span={4}>
        <Row justify="end">{formatNumber(props.balance, "crypto")}</Row>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ swapReducer }, ownProps) => ({
  swapFrom: swapReducer.swapFrom,
  swapTo: swapReducer.swapTo,
  props: ownProps,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addSwapFrom: (payload: ISwapDetails) => dispatch(addSwapFrom(payload)),
  removeSwapFrom: (payload: ISwapDetails) => dispatch(removeSwapFrom(payload)),
  addSwapTo: (payload: ISwapDetails) => dispatch(addSwapTo(payload)),
  removeSwapTo: (payload: ISwapDetails) => dispatch(removeSwapTo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectAssetItem);
