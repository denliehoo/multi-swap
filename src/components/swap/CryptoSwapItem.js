import classes from "./CryptoSwapItem.module.css";
import { Row, Col } from "antd/lib/grid";
import { DownCircleOutlined, PlusCircleOutlined, DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd'
import SelectAssetModal from "./SelectAssetModal";

const CryptoSwapItem = (props) => {
    return (
        <div className={classes.cryptoSwapItem}>
            <Row justify="space-between" align="middle">
                {/* do validation to ensure amount < balance */}
                <Col style={{ fontSize: '2em' }}>{props.amount}</Col>
                <Col>
                    {/* get a list of ERC20 token address and its pic etc
                maybe hard code this
                Future: add token option which saves into local storage */}
                    <SelectAssetModal />
                    {/* <Button>
                        Select an asset<DownOutlined />
                    </Button> */}
                </Col>
            </Row>
            <Row justify="space-between">
                {/* use an api to get the dollar value of an asset
                and then multiply it by amount */}
                <Col>${4000}</Col>
                {/* render this from some api that checks a user's balance given 
                a specific erc20 token; maybe moralis? */}
                <Col>Balanace: {4}</Col>
            </Row>
        </div>
    );
};

export default CryptoSwapItem;