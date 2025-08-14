import classes from './index.module.css';
import { Row, Col } from 'antd/lib/grid';
import { Button } from 'antd';
import React, { useState, useEffect, FC, useCallback } from 'react';
import { MinusCircleOutlined, DownOutlined } from '@ant-design/icons';
import SelectAssetModal from '../modal/select-asset';

import { useSwapState, useSwapDispatch } from '@src/reducers/swap';
import { formatNumber } from '@src/utils/format/number';
import { EBlockchainNetwork, ESWapDirection } from '@src/enum';
import { useConnectWalletState } from '@src/reducers/connect-wallet';

interface ICryptoSwapItem {
  percent?: number;
  amount?: number;
  index: number;
  type: ESWapDirection;
  changeSwapToPercent?: (i: number, percent: number) => void;
  assetHasBeenSelected: () => void;
  amountHasChanged?: () => void;
  asset: string;
  changePercentageFromMinus?: (index: number) => void;
  address: string;
}

const CryptoSwapItem: FC<ICryptoSwapItem> = (props) => {
  const { swapFrom, swapTo } = useSwapState();
  const { chain } = useConnectWalletState();

  const {
    addSwapFromAction: addSwapFrom,
    removeSwapFromAction: removeSwapFrom,
    addSwapToAction: addSwapTo,
    removeSwapToAction: removeSwapTo,
  } = useSwapDispatch();

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState(props.amount);
  const [price, setPrice] = useState(0);
  const [priceIsLoading, setPriceIsLoading] = useState(true);
  const [percentInput, setPercentInput] = useState(props.percent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputIsFocused, setInputIsFocused] = useState(false);

  const getBalanceFromChild = (bal: number) => {
    setBalance(bal);
  };

  const changeAmountInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseFloat(e.target.value);
    if (props.type === ESWapDirection.FROM) {
      setAmount(amount);
      props.amountHasChanged && props.amountHasChanged();

      let newSwapFrom = [...swapFrom];
      newSwapFrom[props.index] = {
        ...newSwapFrom[props.index],
        amount: amount,
      };

      addSwapFrom(newSwapFrom);
    } else if (props.type === ESWapDirection.TO) {
      const re = /^\d*$/;
      if (e.target.value === '' || (re.test(e.target.value) && amount <= 100)) {
        const inputValue = parseFloat(e.target.value);
        setPercentInput(inputValue);
        props.changeSwapToPercent &&
          props.changeSwapToPercent(props.index, inputValue);
        let newSwapTo = [...swapTo];
        newSwapTo[props.index] = {
          ...newSwapTo[props.index],
          amount: inputValue,
        };
        addSwapTo(newSwapTo);
      }
    }
  };

  const minusHandler = () => {
    let newSwap =
      props.type === ESWapDirection.FROM ? [...swapFrom] : [...swapTo];
    let index = props.index;
    newSwap.splice(index, 1);

    // Update the index
    newSwap = newSwap.map((item, i) => ({
      ...item,
      index: i,
    }));

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

  // getPrice ends up in an infinite loop because we are using swapFrom and swapTo, but also using addSwapFrom and addSwapTo within the same function call, essentially causing an infinite loop
  const getPrice = useCallback(
    async (chain: EBlockchainNetwork) => {
      if (props.asset) {
        const params = new URLSearchParams({
          chain,
          asset: props.asset,
          address: props.address,
        });

        const price = await fetch(`/api/asset-price?${params.toString()}`)
          .then((res) => res.text())
          .then((text) => parseFloat(text));

        setPrice(price);
        setPriceIsLoading(false);

        let newSwap =
          props.type === ESWapDirection.FROM ? [...swapFrom] : [...swapTo];
        newSwap[props.index] = {
          ...newSwap[props.index],
          price: price,
        };

        props.type === ESWapDirection.FROM
          ? addSwapFrom(newSwap)
          : addSwapTo(newSwap);
      }
    },
    [
      props.asset,
      props.address,
      props.type,
      props.index,
      swapFrom,
      swapTo,
      addSwapFrom,
      addSwapTo,
    ],
  );

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.addEventListener(
      'wheel',
      function (e: WheelEvent) {
        e.preventDefault();
      },
      { passive: false },
    ); // prevent input from changing on scroll
    setInputIsFocused(true);
  };

  const onInputBlur = () => {
    setInputIsFocused(false);
  };

  useEffect(() => {
    props.type === 'from'
      ? setAmount(props.amount)
      : setPercentInput(props.percent);
  }, [props.amount, props.percent, props.type]);

  // TODO: Fix infinite loop issue
  useEffect(() => {
    getPrice(chain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    chain,
    //  getPrice,
    props.asset,
  ]);

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
        <Col style={{ fontSize: '2em' }} span={12}>
          {props.type === ESWapDirection.FROM ? (
            <input
              className={[classes.inputBox, classes.numberInput].join(' ')}
              onChange={changeAmountInputHandler}
              value={amount}
              placeholder={'0.0'}
              type={'number'}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
          ) : (
            <Row style={{ width: '200%' }}>
              <Col>
                <input
                  className={classes.inputBox}
                  onChange={changeAmountInputHandler}
                  placeholder={'0'}
                  value={percentInput}
                  type={'number'}
                  min={'0'}
                  max={'100'}
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
            style={{ borderRadius: '10px' }}
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
              amount={props.type === 'from' ? amount || 0 : percentInput || 0}
              passBalanceToParent={
                props.type === 'from' ? getBalanceFromChild : () => {}
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
              ? '...'
              : formatNumber(price * (props?.amount || 0), 'fiat')}
          </Col>
          <Col>Balance: {props.asset && formatNumber(balance, 'crypto')}</Col>
        </Row>
      ) : (
        <Row style={{ marginTop: '5px' }}>
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

export default CryptoSwapItem;
