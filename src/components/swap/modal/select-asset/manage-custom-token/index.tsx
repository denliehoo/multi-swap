import classes from "./index.module.css";
import { Row, Col } from "antd/lib/grid";
import { useState, useEffect, FC } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ManageCustomTokenItem from "./item";
import { connect } from "react-redux";
import { getDetailsForCustomToken } from "@src/api";
import { localStorageKey } from "@src/config";
import { EBlockchainNetwork } from "@src/enum";
import { useWindowSize } from "@src/hooks/useWindowSize";
import {
  ICustomToken,
  addCustomToken,
  removeAllCustomToken,
} from "@src/reducers/custom-token";
import { RootState, AppDispatch } from "@src/store";
import { IDefaultAssetInfo } from "@src/interface";
import IconComponent from "@src/components/swap/shared/IconComponent";

interface IMapStateToProps {
  ethCustomTokens: ICustomToken[];
  ftmCustomTokens: ICustomToken[];
  goerliCustomTokens: ICustomToken[];
  chain: EBlockchainNetwork;
}

interface IMapDispatchToProps {
  addCustomToken: (payload: ICustomToken[]) => void;
  removeAllCustomToken: () => void;
}

interface IOwnProps {
  defaultAssets: IDefaultAssetInfo[];
  setToggleChangesInCustomToken: any;
}

interface IManageCustomTokenProps
  extends IMapStateToProps,
    IMapDispatchToProps {
  props: IOwnProps;
}

const ManageCustomToken: FC<IManageCustomTokenProps> = ({
  ethCustomTokens,
  addCustomToken,
  removeAllCustomToken,
  ftmCustomTokens,
  goerliCustomTokens,
  chain,
  props,
}) => {
  const [customTokenErrorMessage, setCustomTokenErrorMessage] = useState("");
  const [showImportToken, setShowImportToken] = useState(false);
  const [customTokenData, setCustomTokenData] = useState<
    ICustomToken | undefined
  >(undefined);
  const [renderComponent, setRenderComponent] = useState(false);
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const { width } = useWindowSize();

  /* 
    Problem: Parent component (this comp) isn't aware of the global state changes
    that was made in the child (ManageCustomTokenItem) component.
    Solution:
    This useEffect hook is to cause the entire component to re-render
    beause the ethCustomTokens (store) state change occur in the child component, 
    the parent component is unaware of the state change until it re-renders. 
    Hence, we use const [renderComponent, setRenderComponent] = useState(false)
    and call setRenderComponent(!renderComponent) when we click the delete icon in
    the child component (ManageCustomTokenItem). This in turn causes the state of
    the parent component to change when we click the delete icon. 
    Hence, causing the parent component to render again, making it aware of the
    ethCustomTokens(store) state change. 
    */
  useEffect(() => {}, [renderComponent]);

  const checkIfValidAddress = async (
    tokenAddress: string,
    chain: EBlockchainNetwork
  ) => {
    setCustomTokenErrorMessage("Loading...");
    // For ETH:
    // SIS: 0xd38BB40815d2B0c2d2c866e0c72c5728ffC76dd9
    // AAVE: 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9
    // usdt: 0xdac17f958d2ee523a2206206994597c13d831ec7
    // For FTM:
    // AAVE: 0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B
    // CRV: 0x1E4F97b9f9F913c46F1632781732927B9019C68b
    const res = await getDetailsForCustomToken(chain, tokenAddress);
    const name = await res.data[0].name;
    const symbol = await res.data[0].symbol;
    const decimals = await parseFloat(res.data[0].decimals);
    let logo = await res.data[0].logo;
    if (!logo) {
      logo = "No Logo";
    }

    if (name) {
      const currentCustomTokensSymbol = [
        ...getCustomTokens(chain),
        ...props.defaultAssets,
      ].map((i) => i.symbol);

      if (currentCustomTokensSymbol.includes(symbol)) {
        setCustomTokenErrorMessage("Token already exists");
      } else {
        setCustomTokenData({
          name: name,
          symbol: symbol,
          decimals: decimals,
          logo: logo,
          address: tokenAddress,
        });
        setCustomTokenErrorMessage("");
        setShowImportToken(true);
      }
    } else {
      setCustomTokenErrorMessage("Enter valid token address");
    }
    return;
  };

  const getCustomTokens = (chain: EBlockchainNetwork) => {
    if (chain === EBlockchainNetwork.ETH) {
      return ethCustomTokens;
    } else if (chain === EBlockchainNetwork.FTM) {
      return ftmCustomTokens;
    } else if (chain === EBlockchainNetwork.GOERLI) {
      return goerliCustomTokens;
    } else {
      return goerliCustomTokens;
    }
  };

  const importTokenHandler = (chain: EBlockchainNetwork) => {
    if (!customTokenData) {
      return;
    }
    if (chain === EBlockchainNetwork.ETH) {
      addCustomToken([...ethCustomTokens, customTokenData]);
    } else if (chain === EBlockchainNetwork.FTM) {
      addCustomToken([...ftmCustomTokens, customTokenData]);
    } else if (chain === EBlockchainNetwork.GOERLI) {
      addCustomToken([...goerliCustomTokens, customTokenData]);
    }
    localStorage.removeItem(localStorageKey); // remove current balances from cache because of new token
    setShowImportToken(false);
    props.setToggleChangesInCustomToken();
    setCustomTokenErrorMessage("");
  };

  const onClickChildDeleteHandler = () => {
    setRenderComponent(!renderComponent);
  };

  const deleteAllHandler = () => {
    removeAllCustomToken();
    props.setToggleChangesInCustomToken();
  };

  return (
    <div>
      <Input
        placeholder="Paste Token Address"
        size="large"
        prefix={<SearchOutlined />}
        className={`class-name-custom-ant-input ${
          inputIsFocused && "glowing-border"
        }`}
        onChange={(event) => {
          setShowImportToken(false);
          const inputValue = event.target.value;
          inputValue.length === 42
            ? checkIfValidAddress(inputValue, chain) // eventually do a get chain from global state and replace here
            : setCustomTokenErrorMessage("Enter valid token address");
        }}
        onFocus={() => setInputIsFocused(true)}
        onBlur={() => setInputIsFocused(false)}
      />
      {customTokenErrorMessage ? (
        <div className="color-light-grey">{customTokenErrorMessage}</div>
      ) : (
        <div></div>
      )}
      {showImportToken ? (
        <div className={classes.importTokenContainer}>
          <Row align="middle">
            <Col span={width && width > 490 ? 2 : width && width > 360 ? 3 : 4}>
              <IconComponent imgUrl={customTokenData?.logo} />
            </Col>
            <Col
              span={width && width > 490 ? 10 : width && width > 360 ? 9 : 10}
            >
              <span className="fw-700">{customTokenData?.symbol}</span>
              <span> </span>
              <span>{customTokenData?.name}</span>
            </Col>
            <Col span={width && width > 360 ? 12 : 10}>
              <Row justify="end" align="middle">
                <Button
                  shape="round"
                  type="primary"
                  onClick={() => {
                    importTokenHandler(chain);
                  }}
                >
                  Import
                </Button>
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <div></div>
      )}

      {/* <hr /> */}
      <div className={classes.customTokenContainer}>
        {getCustomTokens(chain)?.length ? (
          <Row justify="space-between">
            <Col>You have {getCustomTokens(chain)?.length} custom tokens</Col>
            <Col>
              {/* <Button onClick={deleteAllHandler}>Clear All</Button> */}
              <div className={classes.clearAll} onClick={deleteAllHandler}>
                Clear All
              </div>
            </Col>
          </Row>
        ) : (
          <span></span>
        )}

        {getCustomTokens(chain)?.length ? (
          getCustomTokens(chain)?.map(
            (i: { name: any; symbol: any; logo: any; address: any }) => (
              <ManageCustomTokenItem
                name={i.name}
                symbol={i.symbol}
                icon={i.logo}
                chain={chain}
                address={i.address}
                onClickDelete={onClickChildDeleteHandler}
                setToggleChangesInCustomToken={
                  props.setToggleChangesInCustomToken
                }
              />
            )
          )
        ) : (
          <div>You got no custom tokens!</div>
        )}
      </div>
      <hr />
      <div>Note: Custom tokens are stored locally in your browser</div>
    </div>
  );
};

const mapStateToProps = (
  { customTokenReducer, connectWalletReducer }: RootState,
  ownProps: IOwnProps
) => ({
  ethCustomTokens: customTokenReducer.eth,
  ftmCustomTokens: customTokenReducer.ftm,
  goerliCustomTokens: customTokenReducer.goerli,
  chain: connectWalletReducer.chain,
  props: ownProps,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addCustomToken: (payload: ICustomToken[]) =>
    dispatch(addCustomToken(payload)),
  removeAllCustomToken: () => dispatch(removeAllCustomToken()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageCustomToken);
