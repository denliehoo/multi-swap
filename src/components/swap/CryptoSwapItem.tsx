import classes from "./CryptoSwapItem.module.css";
import { Row, Col } from "antd/lib/grid";
import { Button } from "antd";
import SelectAssetModal from "./modal/selectAssetModal/SelectAssetModal";
import React, { useState, useEffect } from "react";
import { MinusCircleOutlined, DownOutlined } from "@ant-design/icons";
import { getAssetPrice } from "../../api/api";
import { connect } from "react-redux";
import {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
  ISwapDetails,
} from "../../reducers/swap";
import { formatNumber } from "../../utils/format/formatNumber";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Dispatch } from "redux";

const CryptoSwapItemTest = ({
  props,
  addSwapFrom,
  addSwapTo,
  swapFrom,
  swapTo,
  removeSwapFrom,
  removeSwapTo,
  chain,
}) => {
  const [balance, setBalance] = useState("");
  const [amount, setAmount] = useState(props.amount);
  const [price, setPrice] = useState(0);
  const [priceIsLoading, setPriceIsLoading] = useState(true);
  const [percentInput, setPercentInput] = useState(props.percent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const { width } = useWindowSize();

  useEffect(() => {
    props.type === "from"
      ? setAmount(props.amount)
      : setPercentInput(props.percent);
  }, [props.amount, props.percent]);

  useEffect(() => {
    getPrice(chain);
  }, [props.asset]);

  const getBalanceFromChild = (bal) => {
    setBalance(bal);
  };

  const changeAmountInputHandler = (e) => {
    if (props.type === "from") {
      setAmount(e.target.value);
      props.amountHasChanged();
      let newSwapFrom = [...swapFrom];
      newSwapFrom[props.index].amount = parseFloat(e.target.value);
      addSwapFrom(newSwapFrom);
    } else if (props.type === "to") {
      const re = /^\d*$/;
      if (
        e.target.value === "" ||
        (re.test(e.target.value) && e.target.value <= 100)
      ) {
        const inputValue = parseFloat(e.target.value);
        setPercentInput(inputValue);
        props.changeSwapToPercent(props.index, inputValue);
        let newSwapTo = [...swapTo];
        newSwapTo[props.index].amount = inputValue;
        addSwapTo(newSwapTo);
      }
    }
  };

  const minusHandler = () => {
    let newSwap = props.type === "from" ? [...swapFrom] : [...swapTo];
    let index = props.index;
    newSwap.splice(index, 1);
    for (let i = index; i < newSwap.length; i++) {
      newSwap[i].index -= 1;
    }
    if (props.type === "from") {
      removeSwapFrom(newSwap);
      setAmount(newSwap[index]?.amount);
    } else if (props.type === "to") {
      removeSwapTo(newSwap);
      setPercentInput(newSwap[index]?.amount);
      props.changePercentageFromMinus(props.index);
    }
    props.assetHasBeenSelected();
  };

  const getPrice = async (chain) => {
    if (props.asset) {
      const price = await getAssetPrice(chain, props.asset, props.address);
      setPrice(price);
      setPriceIsLoading(false);

      let newSwap = props.type === "from" ? [...swapFrom] : [...swapTo];
      newSwap[props.index].price = price;
      props.type === "from" ? addSwapFrom(newSwap) : addSwapTo(newSwap);
    } else {
      // console.log('empty asset!')
    }
  };

  const onInputFocus = (e) => {
    e.target.addEventListener(
      "wheel",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    ); // prevent input from changing on scroll
    setInputIsFocused(true);
  };
  const onInputBlur = () => {
    setInputIsFocused(false);
  };

  return (
    <div
      className={
        inputIsFocused
          ? `${classes.cryptoSwapItem} glowing-border`
          : classes.cryptoSwapItem
      }
    >
      {props.type === "from" ? (
        <React.Fragment>
          <Row>Amount To Swap</Row>
          <Col>
            {swapFrom.length > 1 && (
              <MinusCircleOutlined
                className={classes.minus}
                onClick={minusHandler}
              />
            )}
          </Col>
        </React.Fragment>
      ) : (
        <React.Fragment>
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
        </React.Fragment>
      )}

      <Row justify="space-between" align="middle">
        <Col style={{ fontSize: "2em" }} span={12}>
          {props.type === "from" ? (
            <input
              className={[classes.inputBox, classes.numberInput].join(" ")}
              onChange={changeAmountInputHandler}
              value={amount}
              placeholder={"0.0"}
              type={"number"}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          ) : (
            <Row style={{ width: "200%" }}>
              <Col>
                <input
                  className={classes.inputBox}
                  onChange={changeAmountInputHandler}
                  placeholder={"0"}
                  value={percentInput}
                  type={"number"}
                  min={"0"}
                  max={"100"}
                  onFocus={onInputFocus}
                  onBlur={onInputBlur}
                />
              </Col>
              <Col>
                <span>%</span>
              </Col>
            </Row>
          )}
        </Col>

        <Col>
          <Button
            type="primary"
            style={{ borderRadius: "10px" }}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            {props.asset ? props.asset : <span>Select A Token</span>}
            <DownOutlined />
          </Button>
          {
            <SelectAssetModal
              isModalOpen={isModalOpen}
              index={props.index}
              type={props.type}
              amount={props.type === "from" ? amount : percentInput}
              passBalanceToParent={
                props.type === "from" ? getBalanceFromChild : () => {}
              }
              assetHasBeenSelected={props.assetHasBeenSelected}
              asset={props.asset}
              closeModal={() => {
                setIsModalOpen(false);
              }}
            />
          }
        </Col>
      </Row>

      {props.type === "from" ? (
        <Row justify="space-between">
          <Col>
            {priceIsLoading
              ? "..."
              : formatNumber(price * props.amount, "fiat")}
          </Col>
          <Col>Balance: {props.asset && formatNumber(balance, "crypto")}</Col>
        </Row>
      ) : (
        <Row style={{ marginTop: "5px" }}>
          <input
            type="range"
            id="points"
            name="points"
            min="0"
            max="100"
            step="5"
            value={percentInput}
            onChange={changeAmountInputHandler}
            className={classes.inputSlider}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
          />
        </Row>
      )}
    </div>
  );
};

const mapStateToProps = ({ swapReducer, connectWalletReducer }, ownProps) => ({
  swapFrom: swapReducer.swapFrom,
  swapTo: swapReducer.swapTo,
  props: ownProps,
  chain: connectWalletReducer.chain,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addSwapFrom: (payload: ISwapDetails) => dispatch(addSwapFrom(payload)),
  removeSwapFrom: (payload: ISwapDetails) => dispatch(removeSwapFrom(payload)),
  addSwapTo: (payload: ISwapDetails) => dispatch(addSwapTo(payload)),
  removeSwapTo: (payload: ISwapDetails) => dispatch(removeSwapTo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CryptoSwapItemTest);
