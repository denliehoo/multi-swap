import { Button, Col, Row } from "antd";
import { FC } from "react";
import classes from "../index.module.css";
import { RightCircleOutlined } from "@ant-design/icons";

interface ISwapModalSwapSubmittedContent {
  resetSwapToDefaultHandler: () => void;
}

const SwapModalSwapSubmittedContent: FC<ISwapModalSwapSubmittedContent> = ({
  resetSwapToDefaultHandler,
}) => {
  return (
    <div className={classes.modalContentsContainer}>
      <Row
        align="middle"
        justify="center"
        style={{ width: "100%", height: "100%", textAlign: "center" }}
      >
        <Col>
          <Row align="middle" justify="center">
            <RightCircleOutlined
              style={{
                fontSize: "128px",
                fontWeight: "normal",
                padding: "10px",
              }}
            />
          </Row>
          <Row align="middle" justify="center">
            <div className="fw-700 mb-15">Your swap has been submitted!</div>
            <Button
              onClick={resetSwapToDefaultHandler}
              type="primary"
              shape="round"
              block
            >
              Close
            </Button>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default SwapModalSwapSubmittedContent;
