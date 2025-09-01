import classes from './index.module.css';
import { Row, Col } from 'antd';
import { DeleteOutlined, ScanOutlined } from '@ant-design/icons';
import { FC } from 'react';

import { EBlockchainNetwork } from '@src/enum';
import { useWindowSize } from '@src/hooks/useWindowSize';
import {
  useCustomTokenDispatch,
  useCustomTokenState,
} from '@src/reducers/custom-token';
import IconComponent from '@src/components/swap/shared/IconComponent';

interface IManageCustomTokenItem {
  chain: EBlockchainNetwork;
  symbol: string;
  onClickDelete: () => void;
  setToggleChangesInCustomToken: () => void;
  address: string;
  icon: string;
  name: string;
}

const ManageCustomTokenItem: FC<IManageCustomTokenItem> = (props) => {
  const {
    eth: ethCustomTokens,
    ftm: ftmCustomTokens,
    sepolia: sepoliaCustomTokens,
  } = useCustomTokenState();

  const { removeCustomTokenAction: removeCustomToken } =
    useCustomTokenDispatch();

  const { width } = useWindowSize();
  const getCustomTokens = (chain: EBlockchainNetwork) => {
    if (chain === EBlockchainNetwork.ETH) {
      return ethCustomTokens;
    } else if (chain === EBlockchainNetwork.FTM) {
      return ftmCustomTokens;
    } else if (chain === EBlockchainNetwork.SEPOLIA) {
      return sepoliaCustomTokens;
    }
    return sepoliaCustomTokens;
  };
  const deleteHandler = () => {
    const customTokens = getCustomTokens(props.chain);
    const customTokenSymbols = customTokens.map((i) => i.symbol);
    const indexOfAsset = customTokenSymbols.indexOf(props.symbol);
    customTokens.splice(indexOfAsset, 1); // remove the entire {asset} from the customTokens array
    removeCustomToken(customTokens);
    props.onClickDelete();
    props.setToggleChangesInCustomToken();
  };

  const tokenContractWebsiteHandler = () => {
    if (props.chain === EBlockchainNetwork.ETH) {
      return (
        <a
          href={`https://etherscan.io/address/${props.address}`}
          target="_blank"
          rel="noreferrer"
        >
          <ScanOutlined className={classes.icon} />
        </a>
      );
    } else if (props.chain === EBlockchainNetwork.FTM) {
      return (
        <a
          href={`https://ftmscan.com/address/${props.address}`}
          target="_blank"
          rel="noreferrer"
        >
          <ScanOutlined className={classes.icon} />
        </a>
      );
    } else if (props.chain === EBlockchainNetwork.SEPOLIA) {
      return (
        <a
          href={`https://sepolia.etherscan.io/address/${props.address}`}
          target="_blank"
          rel="noreferrer"
        >
          <ScanOutlined className={classes.icon} />
        </a>
      );
    }
  };
  return (
    <Row
      align="middle"
      justify="space-evenly"
      className={classes.manageCustomTokenItemContainer}
    >
      <Col span={width && width > 470 ? 2 : width && width > 360 ? 3 : 4}>
        <IconComponent imgUrl={props.icon} />
      </Col>
      <Col span={width && width > 470 ? 18 : width && width > 360 ? 17 : 16}>
        <Row>
          {props.symbol} {props.name}
        </Row>
      </Col>
      <Col span={2}>
        <Row justify="end">
          <DeleteOutlined className={classes.icon} onClick={deleteHandler} />
        </Row>
      </Col>
      <Col span={2}>
        <Row justify="end">{tokenContractWebsiteHandler()}</Row>
      </Col>
    </Row>
  );
};

export default ManageCustomTokenItem;
