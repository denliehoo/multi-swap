import classes from "./Swap.module.css";
import { Row, Col } from "antd/lib/grid";
import { Button } from 'antd'
import { DownCircleOutlined, PlusCircleOutlined, DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useState } from "react";
import CryptoSwapItem from "./CryptoSwapItem";
import SelectAsset from "./SelectAsset";


const Swap = () => {
    const [fromAssets, setFromAssets] = useState([{ amount: 0, selectedAsset: "Select An Asset" }])
    const [toAssets, setToAssets] = useState([{ amount: 0, selectedAsset: "Select An Asset" }])


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

                <Row >You Sell - Swapping assets</Row>
                <div className={classes.buySellContainer}>
                    {
                        fromAssets.map((i) => <CryptoSwapItem amount={i.amount} />)
                        // fromAssets.map((i) => console.log(i))
                    }
                    <Row justify="center" align="middle" style={{ position: 'relative', top: '5px' }}>
                        <Button block shape="round" icon={<PlusCircleOutlined />} onClick={() => {
                            setFromAssets([...fromAssets, { amount: 0 }])
                        }} />
                    </Row>


                </div>
                <div style={{ margin: '5px' }}>
                    <DownCircleOutlined style={{ fontSize: '200%' }} />
                </div>
                <Row>You Get</Row>
                <div className={classes.buySellContainer}>
                    {/* {cryptoSwapItem} */}
                    {
                        toAssets.map((i) => <CryptoSwapItem amount={i.amount} />)
                    }


                    <Row justify="center" align="middle" style={{ position: 'relative', top: '5px' }}>
                        <Button block shape="round" icon={<PlusCircleOutlined />} onClick={() => {
                            setToAssets([...toAssets, { amount: 0 }])
                        }} />
                    </Row>
                </div>
                <div style={{ width: '100%' }}>
                    {/* need do this for each asset being swapped */}
                    <div><InfoCircleOutlined /> 1 BOT = 23.012 TOP</div>
                    <div><InfoCircleOutlined /> 1 BOT = 23.012 TOP</div>
                </div>

                <Row style={{ width: '100%' }}>
                    <Button size="large" block shape="round" onClick={() => { console.log("hello world") }}>Swap</Button>
                </Row>
            </div>
        </div >
    );
};

export default Swap;