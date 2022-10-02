// import classes from "./ManageCustomToken.module.css";
import axios from 'axios'
import { Row, Col } from 'antd/lib/grid'
import React, { useState, useEffect } from 'react'
import { Input, Button } from 'antd'
import IconComponent from '../shared/IconComponent'
import { SearchOutlined } from '@ant-design/icons'
import ManageCustomTokenItem from './ManageCustomTokenItem'

import { connect } from 'react-redux'
import {
  addCustomToken,
  removeAllCustomToken,
} from '../../../reducers/customTokenReducer'

const ManageCustomToken = ({
  ethCustomTokens,
  addCustomToken,
  removeAllCustomToken,
}) => {
  const [customTokenErrorMessage, setCustomTokenErrorMessage] = useState('')
  const [showImportToken, setShowImportToken] = useState(false)
  const [customTokenData, setCustomTokenData] = useState({})
  const [renderComponent, setRenderComponent] = useState(false)

  /* 
    Problem: Parent component (this comp) isn't aware of the global state changes
    that was made in the child (ManageCustomTokenItem) component.
    Solution:
    This useEffect hook is to cause the entire component to re-render
    beause the ethCustomTokens (store) state change occur in the child component, 
    the parent component is unaware of the state change until it re-renders. 
    Hence, we use const [renderComponent, setRenderComponent] = useState(false)
    and call setRenderComponent(!renderComponent) when we click the delete icon in
    the child component (ManageCustomTokenItem). This in turn causes the state of
    the parent component to change when we click the delete icon. 
    Hence, causing the parent component to render again, making it aware of the
    ethCustomTokens(store) state change. 
    */
  useEffect(() => {}, [renderComponent])

  const checkIfValidAddress = async (tokenAddress, chain) => {
    setCustomTokenErrorMessage('Loading...')
    // SIS: 0xd38BB40815d2B0c2d2c866e0c72c5728ffC76dd9
    // AAVE: 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9
    // usdt: 0xdac17f958d2ee523a2206206994597c13d831ec7
    const res = await axios.get(
      `https://deep-index.moralis.io/api/v2/erc20/metadata?chain=${chain}&addresses=${tokenAddress}`,
      {
        headers: {
          accept: 'application/json',
          'X-API-Key': process.env.REACT_APP_MORALIS_API_KEY,
        },
      },
    )
    const name = await res.data[0].name
    const symbol = await res.data[0].symbol
    const decimals = await res.data[0].decimals
    let logo = await res.data[0].logo
    if (!logo) {
      logo = 'No Logo'
    }

    if (name) {
      const currentCustomTokens = getCustomTokens(chain)
      const currentCustomTokensSymbol = currentCustomTokens.map((i) => i.symbol)
      if (currentCustomTokensSymbol.includes(symbol)) {
        setCustomTokenErrorMessage('Token has already been imported')
      } else {
        setCustomTokenData({
          name: name,
          symbol: symbol,
          decimals: decimals,
          logo: logo,
          address: tokenAddress,
        })
        setCustomTokenErrorMessage('')
        setShowImportToken(true)
      }
    } else {
      setCustomTokenErrorMessage('Enter valid token address')
    }
    return
  }

  const getCustomTokens = (chain) => {
    if (chain === 'eth') {
      return ethCustomTokens
    }
  }

  const importTokenHandler = (chain) => {
    if (chain === 'eth') {
      addCustomToken([...ethCustomTokens, customTokenData])
    }
    setShowImportToken(false)
    setCustomTokenErrorMessage('')
  }

  const onClickChildDeleteHandler = () => {
    setRenderComponent(!renderComponent)
  }

  const deleteAllHandler = () => {
    removeAllCustomToken([])
  }

  return (
    <div>
      <Input
        placeholder="Search name or paste address"
        size="large"
        prefix={<SearchOutlined />}
        style={{ width: '100%', borderRadius: '10px' }}
        onChange={(event) => {
          setShowImportToken(false)
          const inputValue = event.target.value
          inputValue.length === 42
            ? checkIfValidAddress(inputValue, 'eth') // eventually do a get chain from global state and replace here
            : setCustomTokenErrorMessage('Enter valid token address')
        }}
      />
      {customTokenErrorMessage ? (
        <div style={{ color: 'red' }}>{customTokenErrorMessage}</div>
      ) : (
        <div></div>
      )}
      {showImportToken ? (
        <div
          style={{
            border: '1px solid black',
            borderRadius: '10px',
            padding: '10px',
            margin: '10px',
          }}
        >
          <Row align="middle">
            <Col span={2}>
              <IconComponent imgUrl={customTokenData.logo} />
            </Col>
            <Col span={10}>
              <span style={{ fontWeight: '700' }}>
                {customTokenData.symbol}
              </span>
              <span> </span>
              <span style={{}}>{customTokenData.name}</span>
            </Col>
            <Col span={12}>
              <Row justify="end" align="middle">
                <Button
                  shape="round"
                  onClick={() => {
                    importTokenHandler('eth')
                  }}
                >
                  Import
                </Button>
              </Row>
            </Col>
          </Row>
        </div>
      ) : (
        <div></div>
      )}

      <hr />
      <div style={{ height: '30vh' }}>
        {getCustomTokens('eth').length ? (
          <Row justify="space-between">
            <Col>You have {getCustomTokens('eth').length} custom tokens</Col>
            <Col>
              <Button onClick={deleteAllHandler}>Clear All</Button>
            </Col>
          </Row>
        ) : (
          <span></span>
        )}

        {getCustomTokens('eth').length ? (
          getCustomTokens('eth').map((i) => (
            <ManageCustomTokenItem
              name={i.name}
              symbol={i.symbol}
              icon={i.logo}
              chain={'eth'}
              address={i.address}
              onClickDelete={onClickChildDeleteHandler}
            />
          ))
        ) : (
          <div>You got no custom tokens!</div>
        )}
      </div>
      <hr />
      <div>Note: Custom tokens are stored locally in your browser</div>
    </div>
  )
}

const mapStateToProps = ({ customTokenReducer }) => ({
  ethCustomTokens: customTokenReducer.eth,
})

const mapDispatchToProps = (dispatch) => ({
  addCustomToken: (payload) => dispatch(addCustomToken(payload)),
  removeAllCustomToken: (payload) => dispatch(removeAllCustomToken(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageCustomToken)
