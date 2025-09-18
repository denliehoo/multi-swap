import React, { useState, useEffect, FC, useCallback } from 'react';
import SwapItemInputAndSelect from './input-and-select';

import { useSwapState, useSwapDispatch } from '@src/reducers/swap';
import { EBlockchainNetwork, ESWapDirection } from '@src/enum';
import { useConnectWalletState } from '@src/reducers/connect-wallet';
import { getAssetPrice } from '@src/api';
import { cx } from '@src/utils/theme/cx';
import SwapSliderOrAssetDetails from './slider-or-asset-details';
import SwapItemHeader from './header';

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
    const amount = Number.parseFloat(e.target.value);
    if (props.type === ESWapDirection.FROM) {
      setAmount(amount);
      props.amountHasChanged?.();

      const newSwapFrom = [...swapFrom];
      newSwapFrom[props.index] = {
        ...newSwapFrom[props.index],
        amount: amount,
      };

      addSwapFrom(newSwapFrom);
    } else if (props.type === ESWapDirection.TO) {
      const re = /^\d*$/;
      if (e.target.value === '' || (re.test(e.target.value) && amount <= 100)) {
        const inputValue = Number.parseFloat(e.target.value);
        setPercentInput(inputValue);
        props.changeSwapToPercent?.(props.index, inputValue);
        const newSwapTo = [...swapTo];
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
    const index = props.index;
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
      props.changePercentageFromMinus?.(props.index);
    }
    props.assetHasBeenSelected();
  };

  // getPrice ends up in an infinite loop because we are using swapFrom and swapTo, but also using addSwapFrom and addSwapTo within the same function call, essentially causing an infinite loop
  const getPrice = useCallback(
    async (chain: EBlockchainNetwork) => {
      if (props.asset) {
        const price = await getAssetPrice(chain, props.asset, props.address);
        setPrice(price);
        setPriceIsLoading(false);

        const newSwap =
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
      (e: WheelEvent) => {
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <Putting in getPrice causes an infinite loop issue. TODO: Find a better solution>
  useEffect(() => {
    getPrice(chain);
  }, [
    chain,
    //  getPrice,
    props.asset,
  ]);

  return (
    <div
      className={cx(
        'border-2 border-border-default p-4 mb-4 rounded-2xl',
        inputIsFocused && 'glowing-border',
      )}
    >
      {/* Text and minus icon */}
      <SwapItemHeader
        type={props.type}
        swapFromLength={swapFrom.length}
        swapToLength={swapTo.length}
        minusHandler={minusHandler}
      />

      {/* Input and select button */}
      <SwapItemInputAndSelect
        type={props.type}
        amount={amount}
        percentInput={percentInput}
        changeAmountInputHandler={changeAmountInputHandler}
        onInputFocus={onInputFocus}
        onInputBlur={onInputBlur}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        asset={props.asset}
        index={props.index}
        assetHasBeenSelected={props.assetHasBeenSelected}
        getBalanceFromChild={getBalanceFromChild}
      />

      {/* Price and balance */}
      <SwapSliderOrAssetDetails
        type={props.type}
        price={price}
        priceIsLoading={priceIsLoading}
        amount={amount}
        asset={props.asset}
        balance={balance}
        percentInput={percentInput}
        changeAmountInputHandler={changeAmountInputHandler}
        onInputFocus={onInputFocus}
        onInputBlur={onInputBlur}
      />
    </div>
  );
};

export default CryptoSwapItem;
