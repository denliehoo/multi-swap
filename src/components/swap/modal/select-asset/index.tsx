import classes from './index.module.css';
import { Row, Col } from 'antd/lib/grid';
import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons';
import { Modal } from 'antd';
import { FC, useCallback, useEffect, useState } from 'react';
import ManageCustomToken from './content/manage-custom-token';
import {
  ethDefaultAssetInfo,
  ftmDefaultAssetInfo,
  sepoliaDefaultAssetInfo,
} from '@src/constants/default-asset-info';
import { ICustomToken, useCustomTokenState } from '@src/reducers/custom-token';
import { IDefaultAssetInfo } from '@src/interface';
import { EBlockchainNetwork, ESWapDirection } from '@src/enum';
import { useConnectWalletState } from '@src/reducers/connect-wallet';
import { getTokenBalances } from '@src/api';
import SelectAssetModalContentAsset from './content/asset';
import { useSelectAssetModal } from './hooks';

interface ISelectAssetModal {
  isModalOpen: boolean;
  index: number;
  type: ESWapDirection;
  amount: number;
  passBalanceToParent: (bal: number) => void;
  assetHasBeenSelected: () => void;
  asset: string; // TODO: Rename this to symbol for consistency
  closeModal: () => void;
}

const SelectAssetModal: FC<ISelectAssetModal> = (props) => {
  const {
    setIsManageCustomToken,
    isManageCustomToken,
    closeModalHandler,
    address,
    isLoading,
    getDefaultAssets,
    setToggleChangesInCustomToken,
    toggleChangesInCustomToken,
    combinedAssetList,
    searchInput,
    setSearchInput,
    setSearchInputResults,
    searchInputResults,
    chooseAssetHandler,
    chain,
  } = useSelectAssetModal({
    assetHasBeenSelected: props.assetHasBeenSelected,
    passBalanceToParent: props.passBalanceToParent,
    closeModal: props.closeModal,
    isModalOpen: props.isModalOpen,
  });

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
        open={props.isModalOpen}
        onOk={closeModalHandler}
        onCancel={closeModalHandler}
        destroyOnHidden={true}
        // allows us to edit the bottom component (i.e. the OK and Cancel)
        footer={null}
      >
        {!address ? (
          <div>Please connect your wallet to continue</div>
        ) : isLoading ? (
          <Row align="middle" justify="center">
            <LoadingOutlined style={{ fontSize: '128px' }} />{' '}
          </Row>
        ) : isManageCustomToken ? (
          <ManageCustomToken
            defaultAssets={getDefaultAssets(chain)}
            setToggleChangesInCustomToken={() => {
              setToggleChangesInCustomToken(!toggleChangesInCustomToken);
            }}
          />
        ) : (
          <SelectAssetModalContentAsset
            combinedAssetList={combinedAssetList}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            setSearchInputResults={setSearchInputResults}
            searchInputResults={searchInputResults}
            index={props.index}
            type={props.type}
            amount={props.amount}
            setIsManageCustomToken={setIsManageCustomToken}
            chooseAssetHandler={chooseAssetHandler}
          />
        )}
      </Modal>
    </>
  );
};

export default SelectAssetModal;

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
