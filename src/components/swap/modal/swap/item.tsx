import { formatNumber } from '@src/utils/format/number';
import IconComponent from '../../shared/IconComponent';
import { Row, Col } from 'antd';
import { FC } from 'react';

interface IPreviewSwapItem {
  imgUrl: string;
  symbol: string;
  amount: number;
  price?: number;
}

const PreviewSwapItem: FC<IPreviewSwapItem> = ({
  imgUrl,
  symbol,
  amount,
  price,
}) => {
  return (
    <div className="mt-10 pr-15 pt-5">
      <Row justify="space-between">
        <Row align="middle">
          <IconComponent size={40} imgUrl={imgUrl} />
          <span className="ml-10">{symbol}</span>
        </Row>
        <Row align="middle">
          <Col>
            <Row justify="end" className="fs-xs">
              {formatNumber(amount * (price || 0), 'fiat')}
            </Row>
            <Row justify="end">{formatNumber(amount, 'crypto')}</Row>
          </Col>
        </Row>
      </Row>
    </div>
  );
};

export default PreviewSwapItem;
