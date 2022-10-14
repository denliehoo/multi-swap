import classes from "./Swap.module.css";
import { Row, Col } from "antd/lib/grid";
import { Button } from "antd";
import {
  DownCircleOutlined,
  PlusCircleOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import CryptoSwapItem from "./CryptoSwapItem";

import { connect } from "react-redux";
import {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
} from "../../reducers/swapReducer";

// Swap > CryptoSwapItem > SelectAssetModal > SelectAssetItem

const Swap = ({
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
  swapFrom,
  swapTo,
}) => {
  const [fromAssets, setFromAssets] = useState([
    { amount: 0, selectedAsset: "Select An Asset" },
  ]);
  const [toAssets, setToAssets] = useState([
    { amount: 0, selectedAsset: "Select An Asset" },
  ]);

  // in basis points; i.e. 10,000 = 100% ; 5000 = 50%, etc...
  const [swapToPercentages, setSwapToPercentages] = useState([0]);

  return (
    // follow uniswap style for swap component
    <div className={classes.container}>
      <div className={classes.card}>
        <Row justify="space-between" style={{ width: "100%" }}>
          <Col>Swap</Col>
          <Col>Settings</Col>
        </Row>

        <Row>You Sell - Swapping assets</Row>
        <div className={classes.buySellContainer}>
          {
            fromAssets.map((i, index) => (
              <CryptoSwapItem
                amount={i.amount}
                key={`fromAsset${index}`}
                index={index}
                type={"from"}
              />
            ))
            // fromAssets.map((i) => console.log(i))
          }
          <Row
            justify="center"
            align="middle"
            style={{ position: "relative", top: "5px" }}
          >
            <Button
              block
              shape="round"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setFromAssets([...fromAssets, { amount: 0 }]);
              }}
            />
          </Row>
        </div>
        <div style={{ margin: "5px" }}>
          <DownCircleOutlined style={{ fontSize: "200%" }} />
        </div>
        <Row>You Get</Row>
        <div className={classes.buySellContainer}>
          <div>{swapToPercentages.length}</div>
          {toAssets.map((i, index) => (
            <CryptoSwapItem
              amount={i.amount}
              key={`toAssets${index}`}
              index={index}
              type={"to"}
            />
          ))}

          <Row
            justify="center"
            align="middle"
            style={{ position: "relative", top: "5px" }}
          >
            <Button
              block
              shape="round"
              icon={<PlusCircleOutlined />}
              onClick={() => {
                setToAssets([...toAssets, { amount: 0 }]);
                let newSwapToPercentages = [...swapToPercentages];
                newSwapToPercentages.push(0);
                setSwapToPercentages(newSwapToPercentages);
              }}
            />
          </Row>
        </div>
        <div style={{ width: "100%" }}>
          {/* need do this for each asset being swapped */}
          <div>
            <InfoCircleOutlined /> 1 BOT = 23.012 TOP
          </div>
          <div>
            <InfoCircleOutlined /> 1 BOT = 23.012 TOP
          </div>
        </div>

        <Row style={{ width: "100%" }}>
          <Button
            size="large"
            block
            shape="round"
            onClick={() => {
              // console.log(`${swapFrom} and also ${swapTo}`)
              console.log("swap from: ");
              console.log(swapFrom);
              console.log("swap to: ");
              console.log(swapTo);
            }}
          >
            Swap
          </Button>
        </Row>
      </div>
    </div>
  );
};

const mapStateToProps = ({ swapReducer }) => ({
  swapFrom: swapReducer.swapFrom,
  swapTo: swapReducer.swapTo,
});

const mapDispatchToProps = (dispatch) => ({
  addSwapFrom: (payload) => dispatch(addSwapFrom(payload)),
  removeSwapFrom: (payload) => dispatch(removeSwapFrom(payload)),
  addSwapTo: (payload) => dispatch(addSwapTo(payload)),
  removeSwapTo: (payload) => dispatch(removeSwapTo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
