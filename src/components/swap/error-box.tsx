import { FC, useMemo } from "react";
import { Row, Col } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import classes from "./index.module.css";

interface ErrorBoxProps {
  showAmountError: boolean;
  showPercentageError: boolean;
  showTokenNotSelectedError: boolean;
  showAmountGreaterThanBalanceError: boolean;
}

const ErrorBox: FC<ErrorBoxProps> = ({
  showAmountError,
  showPercentageError,
  showTokenNotSelectedError,
  showAmountGreaterThanBalanceError,
}) => {
  const isError = useMemo(() => {
    return (
      showAmountError ||
      showPercentageError ||
      showTokenNotSelectedError ||
      showAmountGreaterThanBalanceError
    );
  }, [
    showAmountError,
    showPercentageError,
    showTokenNotSelectedError,
    showAmountGreaterThanBalanceError,
  ]);

  const percentageError = (
    <div>
      Please ensure that percentages add up to 100% and that none of the items
      are 0%
    </div>
  );

  const tokenNotSelectedError = (
    <div>Please ensure to select a token before swapping</div>
  );

  const amountError = <div>Please ensure amount from is more than zero</div>;
  const amountGreaterThanBalanceError = (
    <div>Please ensure that amount is less than balance</div>
  );

  return (
    <>
      {isError && (
        <Row className={classes.errorMessagesContainer} align="middle">
          <Col span={4}>
            <Row justify="center">
              <ExclamationCircleOutlined
                style={{ fontSize: "200%", padding: "10px" }}
              />
            </Row>
          </Col>
          <Col span={20}>
            <div className={showAmountError ? classes.errorMessage : undefined}>
              {showAmountError && amountError}
            </div>
            <div
              className={showPercentageError ? classes.errorMessage : undefined}
            >
              {showPercentageError && percentageError}
            </div>
            <div
              className={
                showTokenNotSelectedError ? classes.errorMessage : undefined
              }
            >
              {showTokenNotSelectedError && tokenNotSelectedError}
            </div>
            <div
              className={
                showAmountGreaterThanBalanceError
                  ? classes.errorMessage
                  : undefined
              }
            >
              {showAmountGreaterThanBalanceError &&
                amountGreaterThanBalanceError}
            </div>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ErrorBox;
