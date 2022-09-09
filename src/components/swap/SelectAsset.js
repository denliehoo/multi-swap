// import classes from "./SelectAsset.module.css";
import { Row, Col } from "antd/lib/grid";
import { DownCircleOutlined, PlusCircleOutlined, DownOutlined, InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Modal, Input } from 'antd'
import React, { useState } from 'react';

const SelectAsset = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState('');

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
        setSelectedAsset('ETH')
        //.....

        // closes the modal
        setIsModalOpen(false);
    }

    return (
        <>
            <Button onClick={showModal}>
                {selectedAsset ? selectedAsset : <span>Select A Token</span>}<DownOutlined />
            </Button>
            <Modal title="Select A Token" visible={isModalOpen}
                onOk={handleOk} onCancel={handleCancel}
                // allows us to edit the bottom component (i.e. the OK and Cancel)
                footer={null}
            >
                <Input placeholder="Search name or paste address" size="large" prefix={<SearchOutlined />} style={{ width: '100%', borderRadius: '10px' }} />
                <div>
                    <Row justify="space-evenly">
                        <Button onClick={() => { chooseAssetHandler() }}>ETH</Button>
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
                    {/* line item */}
                    <Row align="middle" justify='space-evenly'>
                        <Col span={2}>Icon</Col>
                        <Col span={18}>
                            <Row>Asset name</Row>
                            <Row>Asset Ticker</Row>
                        </Col>
                        <Col span={4}>
                            <Row justify="end">bal</Row>
                        </Col>
                    </Row>
                </div>

            </Modal>
        </>
    );
};

export default SelectAsset;
