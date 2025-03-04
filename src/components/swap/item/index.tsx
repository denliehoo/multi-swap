import classes from "./index.module.css";
import { Row, Col } from "antd/lib/grid";
import { Button } from "antd";
import React, { useState, useEffect, FC } from "react";
import { MinusCircleOutlined, DownOutlined } from "@ant-design/icons";
import { connect } from "react-redux";
import SelectAssetModal from "../modal/select-asset";

import { Dispatch } from "redux";
import {
  ISwapDetails,
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
} from "@src/reducers/swap";
import { formatNumber } from "@src/utils/format/number";
import { getAssetPrice } from "@src/api";
import { EBlockchainNetwork, ESWapDirection } from "@src/enum";

interface IOwnProps {
  percent?: number;
  amount?: number;

  index: number;
  type: ESWapDirection;
  changeSwapToPercent: (i: number, percent: number) => void;
  assetHasBeenSelected: () => void;
  amountHasChanged?: () => void;
  asset: string;
  changePercentageFromMinus?: (index: number) => void;
  address: string;
}

interface IMapStateToProps {
  swapFrom: ISwapDetails[];
  swapTo: ISwapDetails[];
  chain: EBlockchainNetwork;
}

interface IMapDispatchToProps {
  addSwapFrom: (customToken: ISwapDetails[]) => void;
  addSwapTo: (customToken: ISwapDetails[]) => void;
  removeSwapFrom: (customToken: ISwapDetails[]) => void;
  removeSwapTo: (customToken: ISwapDetails[]) => void;
}

interface ICryptoSwapItem extends IMapStateToProps, IMapDispatchToProps {
  props: IOwnProps;
}

const CryptoSwapItem: FC<ICryptoSwapItem> = ({
  props,
  addSwapFrom,
  addSwapTo,
  swapFrom,
  swapTo,
  removeSwapFrom,
  removeSwapTo,
  chain,
}) => {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(props.amount);
  const [price, setPrice] = useState(0);
  const [priceIsLoading, setPriceIsLoading] = useState(true);
  const [percentInput, setPercentInput] = useState(props.percent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputIsFocused, setInputIsFocused] = useState(false);

  useEffect(() => {
    props.type === "from"
      ? setAmount(props.amount)
      : setPercentInput(props.percent);
  }, [props.amount, props.percent]);

  useEffect(() => {
    getPrice(chain);
  }, [props.asset]);

  const getBalanceFromChild = (bal: number) => {
    setBalance(bal);
  };

  const changeAmountInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (props.type === ESWapDirection.FROM) {
      setAmount(amount);
      props.amountHasChanged && props.amountHasChanged();
      let newSwapFrom = [...swapFrom];
      newSwapFrom[props.index].amount = parseFloat(e.target.value);
      addSwapFrom(newSwapFrom);
    } else if (props.type === ESWapDirection.TO) {
      const re = /^\d*$/;
      if (e.target.value === "" || (re.test(e.target.value) && amount <= 100)) {
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
    let newSwap =
      props.type === ESWapDirection.FROM ? [...swapFrom] : [...swapTo];
    let index = props.index;
    newSwap.splice(index, 1);
    for (let i = index; i < newSwap.length; i++) {
      newSwap[i].index -= 1;
    }
    if (props.type === ESWapDirection.FROM) {
      removeSwapFrom(newSwap);
      setAmount(newSwap[index]?.amount);
    } else if (props.type === ESWapDirection.TO) {
      removeSwapTo(newSwap);
      setPercentInput(newSwap[index]?.amount);
      props.changePercentageFromMinus &&
        props.changePercentageFromMinus(props.index);
    }
    props.assetHasBeenSelected();
  };

  const getPrice = async (chain: EBlockchainNetwork) => {
    if (props.asset) {
      const price = await getAssetPrice(chain, props.asset, props.address);
      setPrice(price);
      setPriceIsLoading(false);

      let newSwap =
        props.type === ESWapDirection.FROM ? [...swapFrom] : [...swapTo];
      newSwap[props.index].price = price;
      props.type === ESWapDirection.FROM
        ? addSwapFrom(newSwap)
        : addSwapTo(newSwap);
    } else {
    }
  };

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.addEventListener(
      "wheel",
      function (e: WheelEvent) {
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
      {/* Text and minus icon */}
      {props.type === ESWapDirection.FROM ? (
        <Row justify="space-between">
          <Col>Amount To Swap</Col>
          <Col>
            {swapFrom.length > 1 && (
              <MinusCircleOutlined
                className={classes.minus}
                onClick={minusHandler}
              />
            )}
          </Col>
        </Row>
      ) : (
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
      )}

      {/* Input and select button */}
      <Row justify="space-between" align="middle">
        <Col style={{ fontSize: "2em" }} span={12}>
          {props.type === ESWapDirection.FROM ? (
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
              amount={props.type === "from" ? amount || 0 : percentInput || 0}
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

      {/* Price and balance */}
      {props.type === ESWapDirection.FROM ? (
        <Row justify="space-between">
          <Col>
            {priceIsLoading
              ? "..."
              : formatNumber(price * (props?.amount || 0), "fiat")}
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
  addSwapFrom: (payload: ISwapDetails[]) => dispatch(addSwapFrom(payload)),
  removeSwapFrom: (payload: ISwapDetails[]) =>
    dispatch(removeSwapFrom(payload)),
  addSwapTo: (payload: ISwapDetails[]) => dispatch(addSwapTo(payload)),
  removeSwapTo: (payload: ISwapDetails[]) => dispatch(removeSwapTo(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CryptoSwapItem);
