import classes from "./ManageCustomTokenItem.module.css";
import { Row, Col } from 'antd'
import IconComponent from "../shared/IconComponent";
import { DeleteOutlined, ScanOutlined } from '@ant-design/icons';


const ManageCustomTokenItem = (props) => {
    const deleteHandler = () => { console.log('delete') }
    const tokenContractWebsiteHandler = () => {
        if (props.chain == "ETH") {
            return (<a href={`https://etherscan.io/address/${props.address}`} target="_blank">
                <ScanOutlined className={classes.icon} />
            </a>)
        }
        // if (props.chain == "...") {
        //     return (<a href={`https://etherscan.io/address/${props.address}`} target="_blank">
        //         <ScanOutlined className={classes.icon} />
        //     </a>)
        // }


    }
    return (
        <Row align="middle" justify='space-evenly'
            className={classes.manageCustomTokenItemContainer}
        >
            <Col span={2}><IconComponent imgUrl={props.icon} /></Col>
            <Col span={18}>
                <Row>{props.symbol} {props.name}</Row>
            </Col>
            <Col span={2}>
                <Row justify="end"><DeleteOutlined className={classes.icon} onClick={deleteHandler} /></Row>
            </Col>
            <Col span={2}>
                <Row justify="end">
                    {tokenContractWebsiteHandler()}
                </Row>
            </Col>
        </Row>
    );
};

export default ManageCustomTokenItem;