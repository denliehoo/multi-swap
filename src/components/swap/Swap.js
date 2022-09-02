import classes from "./Swap.module.css";
import { Row, Col } from "antd/lib/grid";
import { Button } from 'antd'
import { DownCircleOutlined, PlusCircleOutlined, DownOutlined } from '@ant-design/icons';


const Swap = () => {

    const cryptoSwapItem = <div className={classes.cryptoSwapItem}>
        <Row justify="space-between" align="middle">
            <Col style={{ fontSize: '2em' }}>2</Col>
            <Col>
                <Button>
                    Icon + ETH <DownOutlined />
                </Button>
            </Col>
        </Row>
        <Row justify="space-between">
            <Col>$4,000</Col>
            <Col>Balanace: 12</Col>
        </Row>
    </div>


    return (
        // follow uniswap style for swap component
        <div className={classes.container}>
            <div className={classes.card}>
                <Row justify="space-between" style={{ width: '100%' }}>
                    <Col>Swap</Col>
                    <Col>Settings</Col>
                </Row>

                <Row >You Sell</Row>
                <div className={classes.buySellContainer}>
                    {cryptoSwapItem}
                    {cryptoSwapItem}
                    <Row justify="center" align="top" style={{ position: 'relative', top: '5px' }}>
                        <PlusCircleOutlined style={{ fontSize: '200%' }} />
                    </Row>


                </div>
                <div style={{ margin: '5px' }}>
                    <DownCircleOutlined style={{ fontSize: '200%' }} />
                </div>
                <Row>You Get</Row>
                <div className={classes.buySellContainer}>
                    {cryptoSwapItem}
                </div>
                <div>
                    Swap info (e.g. 1 USC = 0.00006 ETH ($1.000)) | Gas fees w/ dropdown
                </div>

                <div>
                    Connect Wallet / Swap
                </div>
            </div>
        </div >
    );
};

export default Swap;