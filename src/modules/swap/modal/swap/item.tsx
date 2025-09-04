import IconComponent from '@src/components/shared/IconComponent';
import { formatNumber } from '@src/utils/format/number';
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
          {/* Note: changed from 40 */}
          <IconComponent size="large" imgUrl={imgUrl} />
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
