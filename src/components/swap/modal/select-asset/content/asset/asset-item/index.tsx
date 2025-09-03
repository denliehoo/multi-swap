import { useWindowSize } from '@src/hooks/useWindowSize';
import { useSwapDispatch, useSwapState } from '@src/reducers/swap';
import { formatNumber } from '@src/utils/format/number';
import classes from './index.module.css';
import { Row, Col } from 'antd/lib/grid';
import { IDefaultAssetInfo } from '@src/interface';
import { FC, ReactNode } from 'react';
import { ESWapDirection } from '@src/enum';

interface ISelectAssetItem extends IDefaultAssetInfo {
  icon: ReactNode;
  index: number;
  type: ESWapDirection;
  amount: number;
  onClickHandler: (bal: number) => void;
}

const SelectAssetItem: FC<ISelectAssetItem> = (props) => {
  const { swapFrom, swapTo } = useSwapState();
  const { addSwapFromAction: addSwapFrom, addSwapToAction: addSwapTo } =
    useSwapDispatch();

  const { width } = useWindowSize();
  const addSwapHandler = (type: ESWapDirection, balance: number) => {
    const newAssetDetails = {
      index: props.index,
      symbol: props.symbol,
      address: props.address,
      balance: balance,
      amount: props.amount,
      decimals: props.decimals,
      imgUrl: props.imgUrl,
    };
    if (type === ESWapDirection.FROM) {
      // if they are the same index, we change the details
      if (props.index === swapFrom[props.index].index) {
        const newSwapFrom = [...swapFrom];
        newSwapFrom[props.index] = newAssetDetails;
        addSwapFrom(newSwapFrom);
      }
    } else if (type === ESWapDirection.TO) {
      const newSwapTo = [...swapTo];
      if (props.index === swapTo[props.index].index) {
        newSwapTo[props.index] = newAssetDetails;
        addSwapTo(newSwapTo);
      }
    }
  };

  return (
    <Row
      align="middle"
      justify="space-evenly"
      className={classes.selectAssetItemContainer}
      onClick={() => {
        addSwapHandler(props.type, props.bal);
        props.onClickHandler(props.bal);
      }}
    >
      <Col span={width && width > 460 ? 2 : width && width > 350 ? 3 : 4}>
        {props.icon}
      </Col>
      <Col span={width && width > 460 ? 18 : width && width > 350 ? 17 : 16}>
        <Row>{props.name}</Row>
        <Row>
          {props.symbol}
          {props.isDefaultAsset ? (
            ''
          ) : (
            <span>
              {' '}
              &nbsp;:<em> Added by user</em>
            </span>
          )}
        </Row>
      </Col>
      <Col span={4}>
        <Row justify="end">{formatNumber(props.bal, 'crypto')}</Row>
      </Col>
    </Row>
  );
};

export default SelectAssetItem;
