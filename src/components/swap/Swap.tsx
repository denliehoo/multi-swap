import classes from "./Swap.module.css";
import { Row, Col } from "antd/lib/grid";
import { Button, notification } from "antd";
import {
  DownCircleOutlined,
  PlusCircleOutlined,
  ExclamationCircleOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import CryptoSwapItem from "./CryptoSwapItem";
import PreviewSwapModal from "./modal/previewSwapModal/PreviewSwapModal";

import { connect } from "react-redux";
import { addSwapFrom, addSwapTo, ISwapDetails } from "../../reducers/swap";
import { attemptToConnectWallet } from "../../reducers/connect-wallet";
import ConnectWalletPopup from "../shared/ConnectWalletPopup";
import { Dispatch } from "redux";
import { EBlockchainNetwork } from "../../enum";

// Swap > CryptoSwapItem > SelectAssetModal > SelectAssetItem

const Swap = ({
  addSwapFrom,
  addSwapTo,
  swapFrom,
  swapTo,
  address,
  attemptToConnectWallet,
  chain,
}) => {
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

  const percentageError = (
    <div>
      Please ensure that percentages add up to 100% and that none of the items
      are 0%
    </div>
  );

  const tokenNotSelectedError = (
    <div>Please ensure to select a token before swapping</div>
  );

  const amountError = <div>Please ensure amount from is more than zero</div>;
  const amountGreaterThanBalanceError = (
    <div>Please ensure that amount is less than balance</div>
  );

  const changeSwapToPercentHandler = (i, percent) => {
    let newSwapToPercentages = [...swapToPercentages];
    newSwapToPercentages[i] = percent;
    setSwapToPercentages(newSwapToPercentages);
    if (showPercentageError) {
      setShowPercentageError(false);
    }
  };

  // in basis points; i.e. 10,000 = 100% ; 5000 = 50%, etc...
  const validatePercentageArray = () => {
    const arrayHasZero = swapToPercentages.includes(0);
    const sumOfArray = swapToPercentages.reduce(
      (partialSum, a) => partialSum + a,
      0
    );
    const valid = arrayHasZero || sumOfArray !== 100 ? false : true;
    if (!valid) {
      setShowPercentageError(true);
    }
    return valid;
  };

  const validateTokenSelected = () => {
    const swapToSymbols = swapTo.map((i) => i.symbol);
    const swapFromSymbols = swapFrom.map((i) => i.symbol);
    const valid =
      swapToSymbols.includes("") || swapFromSymbols.includes("") ? false : true;
    if (!valid) {
      setShowTokenNotSelectedError(true);
    }
    return valid;
  };

  const validateAmount = () => {
    const swapFromAmount = swapFrom.map((i) => i.amount);
    const arrayContainsNaN = (arr) => {
      let results = false;
      for (let i in arr) {
        if (!arr[i]) {
          results = true;
        }
      }
      return results;
    };
    const valid =
      swapFromAmount.includes(0) ||
      swapFromAmount.includes("") ||
      arrayContainsNaN(swapFromAmount)
        ? false
        : true;
    if (!valid) {
      setShowAmountError(true);
    }
    return valid;
  };

  const validateAmountLesserThanBalance = () => {
    const swapFromAmount = swapFrom.map((i) => i.amount);
    const swapFromBalance = swapFrom.map((i) => i.balance);

    let valid = true;
    for (let i in swapFrom) {
      if (swapFromAmount[i] > swapFromBalance[i]) {
        valid = false;
        setShowAmountGreaterThanBalanceError(true);
        // error message
        break;
      }
    }
    return valid;
  };

  const toggleAssetSelectedState = () => {
    setToggleAssetSelected(!toggleAssetSelected);
  };

  const amountHasChanged = () => {
    setShowAmountError(false);
    setShowAmountGreaterThanBalanceError(false);
  };

  const changePercentageFromMinus = (index) => {
    let newSwapToPercentage = [...swapToPercentages];
    newSwapToPercentage.splice(index, 1);
    setSwapToPercentages(newSwapToPercentage);
  };

  const addSwapState = (type, index, newAssetDetails) => {
    if (type === "from") {
      if (!swapFrom[index]) {
        let newSwapFrom = [...swapFrom];
        newSwapFrom.push(newAssetDetails);
        addSwapFrom(newSwapFrom);
      }
    } else if (type === "to") {
      if (!swapTo[index]) {
        let newSwapTo = [...swapTo];
        newSwapTo.push(newAssetDetails);
        addSwapTo(newSwapTo);
      }
    }
  };

  const swapButtonHandler = () => {
    console.log(swapToPercentages);
    console.log(swapFrom);
    console.log(swapTo);
    const validPercentages = validatePercentageArray();
    const tokensSelected = validateTokenSelected();
    const validAmount = validateAmount();
    const amountLesserThanBalance = validateAmountLesserThanBalance();
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
    message,
    description,
    icon,
    placement,
    duration
  ) => {
    api.open({
      message: message,
      description: description,
      icon: icon,
      placement: placement,
      duration: duration,
    });
  };
  //

  useEffect(() => {
    if (showTokenNotSelectedError) {
      setShowTokenNotSelectedError(false);
    }
  }, [toggleAssetSelected]);

  return (
    // follow uniswap style for swap component
    <div className={classes.container}>
      {contextHolder}
      <div className={classes.card}>
        <Row
          justify="space-between"
          style={{ width: "100%", marginBottom: "15px" }}
        >
          <Col style={{ fontWeight: "700", fontSize: "large" }}>Swap</Col>
          {/* <Col><SettingOutlined /></Col> */}
        </Row>

        {(showAmountError ||
          showPercentageError ||
          showTokenNotSelectedError ||
          showAmountGreaterThanBalanceError) && (
          <Row className={classes.errorMessagesContainer} align="middle">
            <Col span={4}>
              <Row justify="center">
                <ExclamationCircleOutlined
                  style={{ fontSize: "200%", padding: "10px" }}
                />
              </Row>
            </Col>
            <Col span={20}>
              <div
                className={showAmountError ? classes.errorMessage : undefined}
              >
                {showAmountError && amountError}
              </div>
              <div
                className={
                  showPercentageError ? classes.errorMessage : undefined
                }
              >
                {showPercentageError && percentageError}
              </div>
              <div
                className={
                  showTokenNotSelectedError ? classes.errorMessage : undefined
                }
              >
                {showTokenNotSelectedError && tokenNotSelectedError}
              </div>
              <div
                className={
                  showAmountGreaterThanBalanceError
                    ? classes.errorMessage
                    : undefined
                }
              >
                {showAmountGreaterThanBalanceError &&
                  amountGreaterThanBalanceError}
              </div>
            </Col>
          </Row>
        )}
        {/* Swap From */}
        <div className={classes.buySellContainer}>
          {swapFrom.map((i, index) => (
            <CryptoSwapItem
              amount={i.amount}
              key={`fromAsset${index}`}
              index={index}
              type={"from"}
              assetHasBeenSelected={toggleAssetSelectedState}
              amountHasChanged={amountHasChanged}
              asset={i.symbol}
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
              icon={<PlusCircleOutlined />}
              onClick={() => {
                // setFromAssets([...fromAssets, { amount: 0 }])
                addSwapState("from", swapFrom.length, {
                  index: swapFrom.length,
                  symbol: "",
                  address: "",
                  balance: 0,
                  amount: "",
                  decimals: 0,
                  imgUrl: "",
                });
              }}
            />
          </Row>
        </div>
        <div style={{ margin: "5px" }}>
          <DownCircleOutlined style={{ fontSize: "200%" }} />
        </div>
        {/* Swap to portion */}
        {/* <Row>You Get</Row> */}
        <div className={classes.buySellContainer}>
          {swapTo.map((i, index) => (
            <CryptoSwapItem
              percent={i.amount}
              key={`toAssets${index}`}
              index={index}
              type={"to"}
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
              icon={<PlusCircleOutlined />}
              onClick={() => {
                addSwapState("to", swapTo.length, {
                  index: swapTo.length,
                  symbol: "",
                  address: "",
                  balance: 0,
                  amount: 100,
                  decimals: 0,
                  imgUrl: "",
                });
                let newSwapToPercentages = [...swapToPercentages];
                newSwapToPercentages.push(100);
                setSwapToPercentages(newSwapToPercentages);
              }}
            />
          </Row>
        </div>

        <Row style={{ width: "100%", marginTop: "15px" }}>
          <Button
            size="large"
            block
            type="primary"
            shape="round"
            disabled={swapIsLoading ? true : false}
            onClick={() => {
              address ? swapButtonHandler() : attemptToConnectWallet(chain);
            }}
          >
            {address ? (
              swapIsLoading ? (
                <LoadingOutlined />
              ) : (
                "Preview Swap"
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

const mapStateToProps = ({ swapReducer, connectWalletReducer }) => ({
  swapFrom: swapReducer.swapFrom,
  swapTo: swapReducer.swapTo,
  address: connectWalletReducer.address,
  chain: connectWalletReducer.chain,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addSwapFrom: (payload: ISwapDetails) => dispatch(addSwapFrom(payload)),
  addSwapTo: (payload: ISwapDetails) => dispatch(addSwapTo(payload)),
  attemptToConnectWallet: (chain: EBlockchainNetwork) =>
    dispatch(attemptToConnectWallet(chain)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Swap);
