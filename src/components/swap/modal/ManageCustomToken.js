// import classes from "./ManageCustomToken.module.css";
import axios from "axios"
import { Row, Col } from "antd/lib/grid";
import React, { useState } from 'react';
import { Input, Button } from 'antd'
import IconComponent from "../shared/IconComponent";
import { SearchOutlined } from '@ant-design/icons';
import ManageCustomTokenItem from "./ManageCustomTokenItem";



const ManageCustomToken = () => {
    const [customTokenErrorMessage, setCustomTokenErrorMessage] = useState("")
    const [showImportToken, setShowImportToken] = useState(false)
    const [customTokenData, setCustomTokenData] = useState({})

    const checkIfValidAddress = async (tokenAddress) => {
        setCustomTokenErrorMessage("Loading...")
        // 0xd38BB40815d2B0c2d2c866e0c72c5728ffC76dd9
        // 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9
        const chain = 'eth'
        const res = await axios.get(`https://deep-index.moralis.io/api/v2/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`, {
            headers: {
                'accept': 'application/json',
                'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY
            }
        })

        const name = await res.data[0].name
        const symbol = await res.data[0].symbol
        const decimals = await res.data[0].decimals
        let logo = await res.data[0].logo
        if (!logo) { logo = "No Logo" }

        if (name) {
            setCustomTokenData({
                name: name,
                symbol: symbol,
                decimals: decimals,
                logo: logo,
                address: tokenAddress
            })
            setCustomTokenErrorMessage("")
            setShowImportToken(true)
        } else {
            setCustomTokenErrorMessage("Enter valid token address")
        }
        return [name, symbol, decimals]
    }

    const mockCustomToken = [
        {
            name: 'Aave Token',
            symbol: 'AAVE',
            icon: 'https://cdn.moralis.io/eth/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png',
            address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
            chain: "ETH"
        },
        {
            name: 'Symbiosis',
            symbol: 'SIS',
            icon: '',
            address: "0xd38BB40815d2B0c2d2c866e0c72c5728ffC76dd9",
            chain: "ETH"
        }

    ]

    return (
        <div>
            <Input placeholder="Search name or paste address" size="large" prefix={<SearchOutlined />} style={{ width: '100%', borderRadius: '10px' }}
                onChange={(event) => {
                    const inputValue = event.target.value
                    console.log(inputValue)
                    inputValue.length == 42 ?
                        (
                            checkIfValidAddress(inputValue)
                        )
                        :
                        (setCustomTokenErrorMessage("Enter valid token address"))
                }}
            />
            {customTokenErrorMessage ? <div style={{ color: "red" }}>{customTokenErrorMessage}</div> : <div></div>}
            {showImportToken ?
                <div style={{ border: '1px solid black', borderRadius: '10px', padding: '10px', margin: '10px' }}>
                    <Row align="middle">
                        <Col span={2}><IconComponent imgUrl={customTokenData.logo} /></Col>
                        <Col span={10}>
                            <span style={{ fontWeight: '700' }}>{customTokenData.symbol}</span>
                            <span> </span>
                            <span style={{}}>{customTokenData.name}</span>
                        </Col>
                        <Col span={12}>
                            <Row justify="end" align="middle">
                                <Button shape="round">Import</Button>
                            </Row>
                        </Col>
                    </Row>
                </div>
                : <div></div>}

            <hr />
            <div style={{ height: '30vh' }}>{
                mockCustomToken.map((i) => <ManageCustomTokenItem name={i.name} symbol={i.symbol} icon={i.icon} chain={i.chain} address={i.address} />)
            }</div>
            <hr />
            <div>Note: Custom tokens are stored locally in your browser</div>

        </div>
    );
};

export default ManageCustomToken;