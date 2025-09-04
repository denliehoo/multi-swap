import { Col, Row } from 'antd';
import classes from '../index.module.css';
import LoadingSpinner from '../loading-spinner';
import { FC } from 'react';

const SwapModalLoadingContent: FC = () => {
  return (
    <div className={classes.modalContentsContainer}>
      <Row
        align="middle"
        justify="center"
        style={{ width: '100%', height: '100%' }}
      >
        <Col>
          <LoadingSpinner />
        </Col>
      </Row>
    </div>
  );
};

export default SwapModalLoadingContent;
