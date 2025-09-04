import classes from './index.module.css';
import { Row, Col } from 'antd/lib/grid';
import { Button, notification } from 'antd';
import {
  DownCircleOutlined,
  PlusCircleOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { FC, ReactNode, useEffect, useState } from 'react';
import CryptoSwapItem from './item';
import PreviewSwapModal from './modal/swap';

import ConnectWalletPopup from '../shared/ConnectWalletPopup';
import { ESWapDirection } from '@src/enum';
import {
  useConnectWalletDispatch,
  useConnectWalletState,
} from '@src/reducers/connect-wallet';
import {
  ISwapDetails,
  useSwapDispatch,
  useSwapState,
} from '@src/reducers/swap';
import {
  validateAmount,
  validateAmountLesserThanBalance,
  validatePercentageArray,
  validateTokenSelected,
} from './validator';
import ErrorBox from './error-box';
import { NotificationPlacement } from 'antd/es/notification/interface';

// Swap > CryptoSwapItem > SelectAssetModal > SelectAssetItem

const DEFAULT_SWAP_STATE: ISwapDetails = {
  index: 0,
  symbol: '',
  address: '',
  balance: 0,
  amount: 0,
  decimals: 0,
  imgUrl: '',
};

const Swap: FC = () => {
  const { swapFrom, swapTo } = useSwapState();
  const { address, chain } = useConnectWalletState();
  const { addSwapFromAction: addSwapFrom, addSwapToAction: addSwapTo } =
    useSwapDispatch();
  const { attemptToConnectWalletAction: attemptToConnectWallet } =
    useConnectWalletDispatch();

  const [swapToPercentages, setSwapToPercentages] = useState([100]);
  const [showPercentageError, setShowPercentageError] = useState(false);
  const [showTokenNotSelectedError, setShowTokenNotSelectedError] =
    useState(false);
  const [showAmountError, setShowAmountError] = useState(false);
  const [
    showAmountGreaterThanBalanceError,
    setShowAmountGreaterThanBalanceError,
  ] = useState(false);
  const [toggleAssetSelected, setToggleAssetSelected] = useState(true);
  const [showPreviewSwapModal, setShowPreviewSwapModal] = useState(false);
  const [swapIsLoading, setSwapIsLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const changeSwapToPercentHandler = (i: number, percent: number) => {
    const newSwapToPercentages = [...swapToPercentages];
    newSwapToPercentages[i] = percent;
    setSwapToPercentages(newSwapToPercentages);
    if (showPercentageError) {
      setShowPercentageError(false);
    }
  };

  const toggleAssetSelectedState = () => {
    setToggleAssetSelected(!toggleAssetSelected);
  };

  const amountHasChanged = () => {
    setShowAmountError(false);
    setShowAmountGreaterThanBalanceError(false);
  };

  const changePercentageFromMinus = (index: number) => {
    const newSwapToPercentage = [...swapToPercentages];
    newSwapToPercentage.splice(index, 1);
    setSwapToPercentages(newSwapToPercentage);
  };

  const addSwapState = (
    type: ESWapDirection,
    index: number,
    newAssetDetails: ISwapDetails,
  ) => {
    if (type === ESWapDirection.FROM) {
      if (!swapFrom[index]) {
        const newSwapFrom = [...swapFrom];
        newSwapFrom.push(newAssetDetails);
        addSwapFrom(newSwapFrom);
      }
    } else if (type === ESWapDirection.TO) {
      if (!swapTo[index]) {
        const newSwapTo = [...swapTo];
        newSwapTo.push(newAssetDetails);
        addSwapTo(newSwapTo);
      }
    }
  };

  const onClickAddSwapState = (type: ESWapDirection) => {
    if (type === ESWapDirection.FROM) {
      addSwapState(ESWapDirection.FROM, swapFrom.length, {
        ...DEFAULT_SWAP_STATE,
        index: swapFrom.length,
      });
    } else if (type === ESWapDirection.TO) {
      addSwapState(ESWapDirection.TO, swapTo.length, {
        ...DEFAULT_SWAP_STATE,
        index: swapTo.length,
        amount: 100,
      });
      const newSwapToPercentages = [...swapToPercentages];
      newSwapToPercentages.push(100);
      setSwapToPercentages(newSwapToPercentages);
    }
  };

  const swapButtonHandler = () => {
    console.log(swapToPercentages);
    console.log(swapFrom);
    console.log(swapTo);
    const validPercentages = validatePercentageArray(
      swapToPercentages,
      setShowPercentageError,
    );
    const tokensSelected = validateTokenSelected(
      swapTo,
      swapFrom,
      setShowTokenNotSelectedError,
    );
    const validAmount = validateAmount(swapFrom, setShowAmountError);
    const amountLesserThanBalance = validateAmountLesserThanBalance(
      swapFrom,
      setShowAmountGreaterThanBalanceError,
    );
    if (
      validPercentages &&
      tokensSelected &&
      validAmount &&
      amountLesserThanBalance
    ) {
      setShowPreviewSwapModal(true);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const showNotificationHandler = (
    message: string,
    description: ReactNode,
    icon: ReactNode,
    placement: NotificationPlacement,
    duration?: number,
  ) => {
    api.open({
      message: message,
      description: description,
      icon: icon,
      placement: placement,
      duration: duration,
    });
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <We want the effect to run when toggleAssetSelected changes too>
  useEffect(() => {
    if (showTokenNotSelectedError) {
      setShowTokenNotSelectedError(false);
    }
  }, [showTokenNotSelectedError, toggleAssetSelected]);

  return (
    // follow uniswap style for swap component
    <div className={classes.container}>
      {contextHolder}
      <div className={classes.card}>
        <Row
          justify="space-between"
          style={{ width: '100%', marginBottom: '15px' }}
        >
          <Col
            style={{ fontWeight: '700', fontSize: 'large' }}
            className="font-bold text-lg italic"
          >
            Swap
          </Col>
        </Row>

        <ErrorBox
          showAmountError={showAmountError}
          showPercentageError={showPercentageError}
          showTokenNotSelectedError={showTokenNotSelectedError}
          showAmountGreaterThanBalanceError={showAmountGreaterThanBalanceError}
        />
        {/* Swap From */}
        <div className={classes.buySellContainer}>
          {swapFrom.map((i, index) => (
            <CryptoSwapItem
              amount={i.amount}
              key={`fromAsset${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              index={index}
              type={ESWapDirection.FROM}
              assetHasBeenSelected={toggleAssetSelectedState}
              amountHasChanged={amountHasChanged}
              asset={i.symbol}
              address={i.address}
            />
          ))}
          <Row
            justify="center"
            align="middle"
            className={classes.plusButtonContainer}
          >
            <Button
              block
              shape="round"
              type="primary"
              onClick={() => onClickAddSwapState(ESWapDirection.FROM)}
            >
              <PlusCircleOutlined />
            </Button>
          </Row>
        </div>
        <div style={{ margin: '5px' }}>
          <DownCircleOutlined style={{ fontSize: '200%' }} />
        </div>
        {/* Swap to portion */}
        {/* <Row>You Get</Row> */}
        <div className={classes.buySellContainer}>
          {swapTo.map((i, index) => (
            <CryptoSwapItem
              percent={i.amount}
              key={`toAssets${
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                index
              }`}
              index={index}
              type={ESWapDirection.TO}
              changeSwapToPercent={changeSwapToPercentHandler}
              assetHasBeenSelected={toggleAssetSelectedState}
              asset={i.symbol}
              changePercentageFromMinus={changePercentageFromMinus}
              address={i.address}
            />
          ))}

          <Row
            justify="center"
            align="middle"
            className={classes.plusButonContainer}
          >
            <Button
              block
              shape="round"
              type="primary"
              onClick={() => onClickAddSwapState(ESWapDirection.TO)}
            >
              {<PlusCircleOutlined />}
            </Button>
          </Row>
        </div>

        <Row style={{ width: '100%', marginTop: '15px' }}>
          <Button
            size="large"
            block
            type="primary"
            shape="round"
            disabled={!!swapIsLoading}
            onClick={() => {
              address ? swapButtonHandler() : attemptToConnectWallet(chain);
            }}
          >
            {address ? (
              swapIsLoading ? (
                <LoadingOutlined />
              ) : (
                'Preview Swap'
              )
            ) : (
              <ConnectWalletPopup placement="top" />
            )}
          </Button>
        </Row>
      </div>
      {
        // do remove state here (maybe leave the thing in global state too, see how)
        // also remember to change percentage array to just [100] and any other relevant
        <PreviewSwapModal
          closePreviewAssetModal={() => {
            setShowPreviewSwapModal(false);
          }}
          visible={showPreviewSwapModal}
          showNotificationInSwapJs={showNotificationHandler}
          setSwapIsLoading={(trueOrFalse) => {
            setSwapIsLoading(trueOrFalse);
          }}
          resetPercentageArray={() => {
            setSwapToPercentages([100]);
          }}
        />
      }
    </div>
  );
};

export default Swap;
