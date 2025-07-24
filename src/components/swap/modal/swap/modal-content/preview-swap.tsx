import { FC, Ref } from 'react';
import classes from '../index.module.css';
import { Button, Row } from 'antd';
import PreviewSwapItem from '../item';
import { CheckCircleOutlined } from '@ant-design/icons';
import { ISwapItemDetails, ITokensRequiringApproval } from '..';

interface ISwapModalPreviewSwapContent {
  previewSwapModalContentRef: Ref<HTMLDivElement>;
  tokensRequiringApproval: ITokensRequiringApproval[];
  approvalRequiredBorder: boolean;
  tokensApproved: string[];
  swapFromDetails: ISwapItemDetails[];
  approveTokenHandler: (token: ITokensRequiringApproval, index: number) => void;
  swapToDetails: ISwapItemDetails[];
  approveAllTokensButtonHandler: () => void;
  initiateSwap: () => void;
}

const SwapModalPreviewSwapContent: FC<ISwapModalPreviewSwapContent> = ({
  previewSwapModalContentRef,
  tokensRequiringApproval,
  approvalRequiredBorder,
  tokensApproved,
  swapFromDetails,
  approveTokenHandler,
  swapToDetails,
  approveAllTokensButtonHandler,
  initiateSwap,
}) => {
  return (
    <div className={classes.modalContentsContainer}>
      <div
        style={{ overflow: 'auto', height: '50vh' }}
        ref={previewSwapModalContentRef}
      >
        <span className="fw-700 color-light-grey">
          Note: This is only an estimation of what you'll receive
        </span>
        {tokensRequiringApproval.length > 0 && (
          <div
            className={`${classes.approveTokensContainer} ${
              approvalRequiredBorder && classes.approveTokensContainerSelected
            }`}
          >
            <Row className="fw-700 mt-10 mb-10" justify="center">
              Tokens Requiring Approval
            </Row>

            <Row
              className={classes.approveTokensButtonContainer}
              justify="center"
            >
              {tokensRequiringApproval.map((i, index) =>
                tokensApproved.includes(i.address) ? (
                  <div className={classes.tokenApproved}>
                    {<CheckCircleOutlined />} Approved {i.symbol}
                  </div>
                ) : (
                  <div style={{ display: 'inline-block' }}>
                    <Button
                      type="primary"
                      onClick={() => approveTokenHandler(i, index)}
                      shape="round"
                      loading={i.buttonIsLoading}
                    >
                      Approve {i.symbol}
                    </Button>
                  </div>
                ),
              )}
            </Row>
          </div>
        )}
        <Row className="fw-700 mt-10">You Give</Row>
        {swapFromDetails.map((i, index) => (
          <PreviewSwapItem
            amount={i.amount}
            symbol={i.symbol}
            price={i.price}
            imgUrl={i.imgUrl}
            key={`${index}previewSwapFrom`}
          />
        ))}

        <Row className="fw-700 mt-10">You Get</Row>
        {swapToDetails.map((i, index) => (
          <PreviewSwapItem
            amount={i.amount}
            symbol={i.symbol}
            price={i.price}
            imgUrl={i.imgUrl}
            key={`${index}previewSwapTo`}
          />
        ))}
      </div>
      {
        <Button
          onClick={() => {
            tokensRequiringApproval.length !== tokensApproved.length
              ? approveAllTokensButtonHandler()
              : initiateSwap();
          }}
          type="primary"
          shape="round"
          block
        >
          {tokensRequiringApproval.length !== tokensApproved.length
            ? 'Approve All Tokens To Proceed'
            : 'Confirm'}
        </Button>
      }
    </div>
  );
};

export default SwapModalPreviewSwapContent;
