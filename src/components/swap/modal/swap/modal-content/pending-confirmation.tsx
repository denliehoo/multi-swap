import { Col, Row } from 'antd';
import LoadingSpinner from '../loading-spinner';
import { FC } from 'react';
import classes from '../index.module.css';
import { getPendingSwapText } from '../utils/text';
import { ISwapItemDetails } from '..';

interface ISwapModalPendingConfirmationContent {
  swapFromDetails: ISwapItemDetails[];
  swapToDetails: ISwapItemDetails[];
}

const SwapModalPendingConfirmationContent: FC<
  ISwapModalPendingConfirmationContent
> = ({ swapFromDetails, swapToDetails }) => {
  return (
    <div className={classes.modalContentsContainer}>
      <Row
        align="middle"
        justify="center"
        style={{ width: '100%', height: '100%', textAlign: 'center' }}
      >
        <Col>
          <Row align="middle" justify="center">
            <LoadingSpinner />
          </Row>
          <Row align="middle" justify="center">
            <div>
              <div className="fw-700 mb-15">Waiting For Confirmation</div>
              <div className="mb-15">
                {getPendingSwapText(swapFromDetails, swapToDetails)}
              </div>
              <div>Confirm this transaction in your wallet</div>
            </div>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SwapModalPendingConfirmationContent;
