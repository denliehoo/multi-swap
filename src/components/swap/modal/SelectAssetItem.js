import classes from "./SelectAssetItem.module.css";
import { Row, Col } from "antd/lib/grid";


const SelectAssetItem = (props) => {
    return (
        <Row align="middle" justify='space-evenly'
            className={classes.selectAssetItemContainer}
            // style={{}}
            onClick={() => {
                props.onClickHandler(props.asset)
                console.log(`Clicked ${props.name}`)
                // eventually put in reducer which passes all details and closes the modal
            }}
        >
            <Col span={2}>{props.icon}</Col>
            <Col span={18}>
                <Row>{props.name}</Row>
                <Row>{props.asset}</Row>
            </Col>
            <Col span={4}>
                <Row justify="end">{props.balance}</Row>
            </Col>
        </Row>
    );
};

export default SelectAssetItem;