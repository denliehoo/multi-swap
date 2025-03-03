import classes from "./index.module.css";
import { Row, Col } from "antd/lib/grid";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import { Button, Modal } from "antd";
import { FC, useEffect, useState } from "react";
import SelectAssetItem from "./asset-item";
import IconComponent from "../../shared/IconComponent";
import ManageCustomToken from "./manage-custom-token";
import {
  ethDefaultAssetInfo,
  ftmDefaultAssetInfo,
  goerliDefaultAssetInfo,
} from "@src/constants/default-asset-info";
import { getTokenBalances } from "@src/api";
import { connect } from "react-redux";
import SearchInputComponent from "../../shared/SearchInputComponent";
import { RootState } from "@src/store";
import { ICustomToken } from "@src/reducers/custom-token";
import { IDefaultAssetInfo } from "@src/interface";
import { EBlockchainNetwork, ESWapDirection } from "@src/enum";

interface IMapStateToProps {
  ethCustomTokens: ICustomToken[];
  ftmCustomTokens: ICustomToken[];
  goerliCustomTokens: ICustomToken[];
  chain: EBlockchainNetwork;
  address: string;
}

interface IOwnProps {
  isModalOpen: boolean;
  index: number;
  type: ESWapDirection;
  amount: number;
  passBalanceToParent: (bal: number) => void;
  assetHasBeenSelected: () => void;
  asset: string; // TODO: Rename this to symbol for consistency
  closeModal: () => void;
}

interface ISelectAssetModal extends IMapStateToProps {
  props: IOwnProps;
}

const SelectAssetModal: FC<ISelectAssetModal> = ({
  props,
  ethCustomTokens,
  ftmCustomTokens,
  goerliCustomTokens,
  chain,
  address,
}) => {
  const [isManageCustomToken, setIsManageCustomToken] = useState(false);
  const [combinedAssetList, setCombinedAssetList] = useState<
    IDefaultAssetInfo[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toggleChangesInCustomToken, setToggleChangesInCustomToken] =
    useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchInputResults, setSearchInputResults] = useState<
    IDefaultAssetInfo[]
  >([]);

  useEffect(() => {
    props.isModalOpen && address && getCombinedListOfAssets(chain, address);
  }, [address, props.isModalOpen, toggleChangesInCustomToken]);

  const getCustomTokens = (chain: EBlockchainNetwork) => {
    if (chain === EBlockchainNetwork.ETH) {
      return ethCustomTokens;
    } else if (chain === EBlockchainNetwork.FTM) {
      return ftmCustomTokens;
    } else if (chain === EBlockchainNetwork.GOERLI) {
      return goerliCustomTokens;
    }
    return goerliCustomTokens;
  };

  const getDefaultAssets = (chain: EBlockchainNetwork) => {
    if (chain === EBlockchainNetwork.ETH) {
      return ethDefaultAssetInfo;
    } else if (chain === EBlockchainNetwork.FTM) {
      return ftmDefaultAssetInfo;
    } else if (chain === EBlockchainNetwork.GOERLI) {
      return goerliDefaultAssetInfo;
    }
    return [];
  };

  const getCombinedListOfAssets = async (
    chain: EBlockchainNetwork,
    address: string
  ) => {
    const defaultAssets = getDefaultAssets(chain);
    const customTokens = getCustomTokens(chain);
    const formattedCustomTokens = customTokens.map((i: ICustomToken) => ({
      symbol: i.symbol,
      name: i.name,
      imgUrl: i.logo,
      address: i.address,
      isDefaultAsset: false,
      bal: 0,
      decimals: i.decimals,
    }));
    let combinedAssetListTemp = defaultAssets.concat(formattedCustomTokens);
    const arrayOfAssetAddresses = combinedAssetListTemp.map((i) => i.address);
    const balancesArray = await getTokenBalances(
      chain,
      address,
      arrayOfAssetAddresses
    );

    for (let i in combinedAssetListTemp) {
      combinedAssetListTemp[i].bal = balancesArray[i];
    }
    setCombinedAssetList(combinedAssetListTemp);
    setIsLoading(false);
    return combinedAssetListTemp;
  };

  const chooseAssetHandler = (bal: number) => {
    props.assetHasBeenSelected();
    props.passBalanceToParent(bal);
    closeModalHandler();
  };

  const closeModalHandler = () => {
    setIsManageCustomToken(false);
    setCombinedAssetList([]);
    setIsLoading(true);
    setToggleChangesInCustomToken(false);
    setSearchInput("");
    setSearchInputResults([]);

    props.closeModal();
  };

  const manageCustomeTokenTitle = (
    <Row justify="space-between">
      <Col
        span={10}
        onClick={() => {
          setIsManageCustomToken(false);
        }}
        className={classes.modalBackArrow}
      >
        <ArrowLeftOutlined />
      </Col>
      <Col span={8}>Manage</Col>
      <Col span={6} />
    </Row>
  );

  return (
    <>
      <Modal
        title={
          isManageCustomToken ? (
            <div>{manageCustomeTokenTitle}</div>
          ) : (
            <div>Select A Token</div>
          )
        }
        visible={props.isModalOpen}
        onOk={closeModalHandler}
        onCancel={closeModalHandler}
        destroyOnClose={true}
        // allows us to edit the bottom component (i.e. the OK and Cancel)
        footer={null}
      >
        {!address ? (
          <div>Please connect your wallet to continue</div>
        ) : isLoading ? (
          <Row align="middle" justify="center">
            <LoadingOutlined style={{ fontSize: "128px" }} />{" "}
          </Row>
        ) : isManageCustomToken ? (
          <ManageCustomToken
            defaultAssets={getDefaultAssets(chain)}
            setToggleChangesInCustomToken={() => {
              setToggleChangesInCustomToken(!toggleChangesInCustomToken);
            }}
          />
        ) : (
          // Select a token component
          <div>
            <SearchInputComponent
              itemToFilter={combinedAssetList}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              setSearchInputResults={setSearchInputResults}
            />
            {/* {commonTokens} */}
            <div>
              <div className={classes.selectAssetsContainer}>
                {(searchInput ? searchInputResults : combinedAssetList).map(
                  (i) => (
                    <SelectAssetItem
                      icon={<IconComponent imgUrl={i.imgUrl} />}
                      symbol={i.symbol}
                      name={i.name}
                      bal={i.bal}
                      isDefaultAsset={i.isDefaultAsset}
                      imgUrl={i.imgUrl}
                      decimals={i.decimals}
                      address={i.address}
                      index={props.index}
                      type={props.type}
                      amount={props.amount}
                      onClickHandler={chooseAssetHandler}
                      key={i.symbol}
                    />
                  )
                )}
                {searchInput && searchInputResults.length === 0 && (
                  <div>Search result in no tokens found</div>
                )}
              </div>
            </div>
            {/* <hr /> */}
            <div>
              <Button
                block
                shape="round"
                type="primary"
                onClick={() => {
                  setIsManageCustomToken(true);
                }}
              >
                Manage Custom Token Addresses
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
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
  address: connectWalletReducer.address,
  props: ownProps,
});

export default connect(mapStateToProps)(SelectAssetModal);

// const commonTokens = (
//   <div>
//     <Row justify="space-evenly">
//       <Button
//         style={{ padding: '0', width: '70px' }}
//         onClick={() => {
//           chooseAssetHandler()
//         }}
//       >
//         <IconComponent
//           imgUrl={
//             'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
//           }
//         />
//         ETH
//       </Button>
//       <Button>DAI</Button>
//       <Button>USDC</Button>
//     </Row>
//     <Row justify="space-evenly">
//       <Button>USDT</Button>
//       <Button>WBTC</Button>
//       <Button>WETH</Button>
//     </Row>
//   </div>
// )
