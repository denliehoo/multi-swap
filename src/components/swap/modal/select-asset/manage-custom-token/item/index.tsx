import classes from "./index.module.css";
import { Row, Col } from "antd";
import { DeleteOutlined, ScanOutlined } from "@ant-design/icons";
import { FC } from "react";

import { connect } from "react-redux";
import { EBlockchainNetwork } from "@src/enum";
import { useWindowSize } from "@src/hooks/useWindowSize";
import { ICustomToken, removeCustomToken } from "@src/reducers/custom-token";
import IconComponent from "@src/components/swap/shared/IconComponent";
import { AppDispatch, RootState } from "@src/store";

interface IOwnProps {
  chain: EBlockchainNetwork;
  symbol: string;
  onClickDelete: () => void;
  setToggleChangesInCustomToken: () => void;
  address: string;
  icon: string;
  name: string;
}

interface IMapStateToProps {
  ethCustomTokens: ICustomToken[];
  ftmCustomTokens: ICustomToken[];
  goerliCustomTokens: ICustomToken[];
}

interface IMapDispatchToProps {
  removeCustomToken: (customToken: ICustomToken[]) => void;
}

interface IManageCustomTokenItem extends IMapStateToProps, IMapDispatchToProps {
  props: IOwnProps;
}

const ManageCustomTokenItem: FC<IManageCustomTokenItem> = ({
  props,
  ethCustomTokens,
  ftmCustomTokens,
  goerliCustomTokens,
  removeCustomToken,
}) => {
  const { width } = useWindowSize();
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
    } else if (props.chain === EBlockchainNetwork.GOERLI) {
      return (
        <a
          href={`https://goerli.etherscan.io/address/${props.address}`}
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

const mapStateToProps = (
  { customTokenReducer }: RootState,
  ownProps: IOwnProps
) => ({
  ethCustomTokens: customTokenReducer.eth,
  ftmCustomTokens: customTokenReducer.ftm,
  goerliCustomTokens: customTokenReducer.goerli,
  props: ownProps,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  removeCustomToken: (payload: ICustomToken[]) =>
    dispatch(removeCustomToken(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageCustomTokenItem);

/*
Note: if a component have it's own props we also need to put ownProps as a 2nd param
in mapStateToProps. Then we define it as props and pass it through our component in the
object i.e. do this const Comp = ({ props, state, action1, action2 }) => {...

    NOTE: doing this is wrong X const Comp = (props,{state,action1,action2}) => {...

https://react-redux.js.org/api/connect#mapstatetoprops-state-ownprops--object
*/
