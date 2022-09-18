import classes from "./SelectAssetModal.module.css";
import { Row, Col } from "antd/lib/grid";
import { ArrowLeftOutlined, DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Modal, Input } from 'antd'
import React, { useState } from 'react';
import SelectAssetItem from "./SelectAssetItem";
import IconComponent from "../shared/IconComponent";
import ManageCustomToken from "./ManageCustomToken";

const SelectAssetModal = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState('');
    const [isManageCustomToken, setIsManageCustomToken] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const chooseAssetHandler = (asset) => {
        //.... choose asset
        // .....
        setSelectedAsset(asset)
        //.....

        // closes the modal
        setIsModalOpen(false);
    }

    const selectAssetInfo = [
        {
            asset: 'ETH',
            name: 'Ethereum',
            imgUrl: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
            bal: 0.203,
        },
        {
            asset: 'USDT',
            name: 'Tether',
            imgUrl: 'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707',
            bal: 0.093
        },
        {
            asset: 'USDC',
            name: 'USD Coin',
            imgUrl: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
            bal: 9102
        },
        {
            asset: 'DAI',
            name: 'Dai',
            imgUrl: 'https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734',
            bal: 1902
        },
        {
            asset: 'UNI',
            name: 'Uniswap',
            imgUrl: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604',
            bal: 23.2
        },
        {
            asset: 'WETH',
            name: 'WETH',
            imgUrl: 'https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295',
            bal: 0.01
        },
        {
            asset: 'Aave',
            name: 'Aave',
            imgUrl: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110',
            bal: 2.31
        },
        {
            asset: 'Aave',
            name: 'Aave',
            imgUrl: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110',
            bal: 2.31
        }, {
            asset: 'Aave',
            name: 'Aave',
            imgUrl: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110',
            bal: 2.31
        }, {
            asset: 'Aave',
            name: 'Aave',
            imgUrl: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110',
            bal: 2.31
        }, {
            asset: 'Aave',
            name: 'Aave',
            imgUrl: 'https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110',
            bal: 2.31
        },
    ]

    const manageCustomeTokenTitle = <Row justify="space-between">
        <Col span={10} onClick={() => { setIsManageCustomToken(false) }} className={classes.modalBackArrow}><ArrowLeftOutlined /></Col>
        <Col span={4}>Manage</Col>
        <Col span={10} />
    </Row>



    return (
        <>
            <Button onClick={showModal}>
                {selectedAsset ? selectedAsset : <span>Select A Token</span>}<DownOutlined />
            </Button>
            <Modal title={isManageCustomToken ? <div>{manageCustomeTokenTitle}</div> : <div>Select A Token</div>} visible={isModalOpen}
                onOk={handleOk} onCancel={handleCancel}
                // allows us to edit the bottom component (i.e. the OK and Cancel)
                footer={null}
                bodyStyle={{ height: '60vh', }}
            >
                {isManageCustomToken ? (
                    <ManageCustomToken />
                )
                    :
                    // Select a token component
                    (
                        <div>
                            <Input placeholder="Search name or paste address" size="large" prefix={<SearchOutlined />} style={{ width: '100%', borderRadius: '10px' }} />
                            <div>
                                <Row justify="space-evenly">
                                    <Button style={{ padding: '0', width: '70px' }} onClick={() => { chooseAssetHandler() }}>
                                        {/* <img style={{ height: '30x', width: '30px', padding: '2px', borderRadius: '50%', border: '1px solid black' }} src={imgUrl} /> */}
                                        <IconComponent imgUrl={"https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880"} />
                                        ETH
                                    </Button>
                                    <Button>DAI</Button>
                                    <Button>USDC</Button>
                                </Row>
                                <Row justify="space-evenly">
                                    <Button>USDT</Button>
                                    <Button>WBTC</Button>
                                    <Button>WETH</Button>
                                </Row>
                            </div>
                            <hr />
                            <div>
                                <div style={{ overflow: 'auto', height: '30vh' }}>
                                    {
                                        selectAssetInfo.map((i) => <SelectAssetItem
                                            icon={<IconComponent imgUrl={i.imgUrl} />} asset={i.asset} name={i.name} balance={i.bal}
                                            onClickHandler={chooseAssetHandler}
                                        />)
                                        // fromAssets.map((i) => console.log(i))
                                    }
                                </div>
                            </div>
                            <hr />
                            <div>
                                <Button block shape="round" onClick={() => { setIsManageCustomToken(true) }}>
                                    Manage Custom Token Addresses
                                </Button>
                            </div>
                        </div>
                    )}

            </Modal>
        </>
    );
};

export default SelectAssetModal;
