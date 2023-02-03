import classes from "./ManageCustomToken.module.css";
import axios from 'axios'
import { Row, Col } from 'antd/lib/grid'
import React, { useState, useEffect } from 'react'
import { Input, Button } from 'antd'
import IconComponent from '../../shared/IconComponent'
import { SearchOutlined } from '@ant-design/icons'
import ManageCustomTokenItem from './ManageCustomTokenItem'
import { getDetailsForCustomToken } from '../../../../api/api'
import { connect } from 'react-redux'
import {
  addCustomToken,
  removeAllCustomToken,
} from '../../../../reducers/customTokenReducer'

const ManageCustomToken = ({
  ethCustomTokens,
  addCustomToken,
  removeAllCustomToken,
  ftmCustomTokens,
  goerliCustomTokens,
  chain,
  props,
}) => {
  const [customTokenErrorMessage, setCustomTokenErrorMessage] = useState('')
  const [showImportToken, setShowImportToken] = useState(false)
  const [customTokenData, setCustomTokenData] = useState({})
  const [renderComponent, setRenderComponent] = useState(false)
  const [inputIsFocused, setInputIsFocused] = useState(false)


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
    // For ETH:
    // SIS: 0xd38BB40815d2B0c2d2c866e0c72c5728ffC76dd9
    // AAVE: 0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9
    // usdt: 0xdac17f958d2ee523a2206206994597c13d831ec7
    // For FTM:
    // AAVE: 0x6a07A792ab2965C72a5B8088d3a069A7aC3a993B
    // CRV: 0x1E4F97b9f9F913c46F1632781732927B9019C68b
    const res = await getDetailsForCustomToken(chain, tokenAddress)
    const name = await res.data[0].name
    const symbol = await res.data[0].symbol
    const decimals = await parseFloat(res.data[0].decimals)
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
    } else if (chain === 'ftm') {
      return ftmCustomTokens
    } else if (chain == 'goerli') {
      return goerliCustomTokens
    }
  }

  const importTokenHandler = (chain) => {
    if (chain === 'eth') {
      addCustomToken([...ethCustomTokens, customTokenData])
    } else if (chain === 'ftm') {
      addCustomToken([...ftmCustomTokens, customTokenData])
    } else if (chain === 'goerli') {
      addCustomToken([...goerliCustomTokens, customTokenData])
    }
    setShowImportToken(false)
    props.setToggleChangesInCustomToken()
    setCustomTokenErrorMessage('')
  }

  const onClickChildDeleteHandler = () => {
    setRenderComponent(!renderComponent)
  }

  const deleteAllHandler = () => {
    removeAllCustomToken([])
    props.setToggleChangesInCustomToken()
  }

  return (
    <div>
      <Input
        placeholder="Paste Token Address"
        size="large"
        prefix={<SearchOutlined />}
        className={`class-name-custom-ant-input ${
          inputIsFocused && 'glowing-border'
        }`}
        onChange={(event) => {
          setShowImportToken(false)
          const inputValue = event.target.value
          inputValue.length === 42
            ? checkIfValidAddress(inputValue, chain) // eventually do a get chain from global state and replace here
            : setCustomTokenErrorMessage('Enter valid token address')
        }}
        onFocus={() =>setInputIsFocused(true)}
        onBlur={() =>setInputIsFocused(false)}
      />
      {customTokenErrorMessage ? (
        <div className="color-light-grey">{customTokenErrorMessage}</div>
      ) : (
        <div></div>
      )}
      {showImportToken ? (
        <div
        className={classes.importTokenContainer}
        >
          <Row align="middle">
            <Col span={2}>
              <IconComponent imgUrl={customTokenData.logo} />
            </Col>
            <Col span={10}>
              <span className="fw-700">
                {customTokenData.symbol}
              </span>
              <span> </span>
              <span>{customTokenData.name}</span>
            </Col>
            <Col span={12}>
              <Row justify="end" align="middle">
                <Button
                  shape="round"
                  type="primary"
                  onClick={() => {
                    importTokenHandler(chain)
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

      {/* <hr /> */}
      <div className={classes.customTokenContainer}>
        {getCustomTokens(chain).length ? (
          <Row justify="space-between">
            <Col>You have {getCustomTokens(chain).length} custom tokens</Col>
            <Col>
              {/* <Button onClick={deleteAllHandler}>Clear All</Button> */}
              <div className={classes.clearAll} onClick={deleteAllHandler}>Clear All</div>
            </Col>
          </Row>
        ) : (
          <span></span>
        )}

        {getCustomTokens(chain).length ? (
          getCustomTokens(chain).map((i) => (
            <ManageCustomTokenItem
              name={i.name}
              symbol={i.symbol}
              icon={i.logo}
              chain={chain}
              address={i.address}
              onClickDelete={onClickChildDeleteHandler}
              setToggleChangesInCustomToken={
                props.setToggleChangesInCustomToken
              }
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

const mapStateToProps = (
  { customTokenReducer, connectWalletReducer },
  ownProps,
) => ({
  ethCustomTokens: customTokenReducer.eth,
  ftmCustomTokens: customTokenReducer.ftm,
  goerliCustomTokens: customTokenReducer.goerli,
  chain: connectWalletReducer.chain,
  props: ownProps,
})

const mapDispatchToProps = (dispatch) => ({
  addCustomToken: (payload) => dispatch(addCustomToken(payload)),
  removeAllCustomToken: (payload) => dispatch(removeAllCustomToken(payload)),
})

export default connect(mapStateToProps, mapDispatchToProps)(ManageCustomToken)
