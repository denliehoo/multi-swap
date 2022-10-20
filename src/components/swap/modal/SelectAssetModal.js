import classes from './SelectAssetModal.module.css'
import { Row, Col } from 'antd/lib/grid'
import {
  ArrowLeftOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Modal, Input } from 'antd'
import React, { useState } from 'react'
import SelectAssetItem from './SelectAssetItem'
import IconComponent from '../shared/IconComponent'
import ManageCustomToken from './ManageCustomToken'

import { connect } from 'react-redux'

const ethDefaultAssetInfo = [
  // refactor this to an external file eventually
  {
    symbol: 'ETH',
    name: 'Ethereum',
    imgUrl:
      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880',
    bal: 0.203,
    address: 'native',
    isDefaultAsset: true,
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    imgUrl:
      'https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707',
    bal: 0.093,
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    isDefaultAsset: true,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    imgUrl:
      'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389',
    bal: 9102,
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    isDefaultAsset: true,
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    imgUrl:
      'https://assets.coingecko.com/coins/images/9956/large/4943.png?1636636734',
    bal: 1902,
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    isDefaultAsset: true,
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    imgUrl:
      'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png?1600306604',
    bal: 23.2,
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    isDefaultAsset: true,
  },
  {
    symbol: 'WETH',
    name: 'WETH',
    imgUrl:
      'https://assets.coingecko.com/coins/images/2518/large/weth.png?1628852295',
    bal: 0.01,
    address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    isDefaultAsset: true,
  },
  {
    symbol: 'Aave',
    name: 'Aave',
    imgUrl:
      'https://assets.coingecko.com/coins/images/12645/large/AAVE.png?1601374110',
    bal: 2.31,
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    isDefaultAsset: true,
  },
]

const SelectAssetModal = ({ props, ethCustomTokens }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState('')
  const [isManageCustomToken, setIsManageCustomToken] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const getCustomTokens = (chain) => {
    if (chain == 'eth') {
      return ethCustomTokens
    }
  }

  const getDefaultAssets = (chain) => {
    if (chain == 'eth') {
      return ethDefaultAssetInfo
    }
  }

  const getCombinedListOfAssets = (chain) => {
    const defaultAssets = getDefaultAssets(chain)
    const customTokens = getCustomTokens(chain)
    const formattedCustomTokens = customTokens.map((i) => ({
      symbol: i.symbol,
      name: i.name,
      imgUrl: i.logo,
      address: i.address,
      isDefaultAsset: false,
      bal: 123, // change bal eventually
    }))
    const combinedAssetList = defaultAssets.concat(formattedCustomTokens)
    return combinedAssetList
  }

  const chooseAssetHandler = (symbol) => {
    //.... choose symbol
    setSelectedAsset(symbol)

    // pass balance to parent
    props.assetHasBeenSelected()
    props.passBalanceToParent(getBalances())

    // closes the modal
    setIsModalOpen(false)
  }

  const getBalances = () => {
    // api here.....
    const bal = 23.21
    return bal
  }

  const manageCustomeTokenTitle = (
    <Row justify="space-between">
      <Col
        span={10}
        onClick={() => {
          setIsManageCustomToken(false)
        }}
        className={classes.modalBackArrow}
      >
        <ArrowLeftOutlined />
      </Col>
      <Col span={4}>Manage</Col>
      <Col span={10} />
    </Row>
  )

  return (
    <>
      <Button onClick={showModal}>
        {selectedAsset ? selectedAsset : <span>Select A Token</span>}
        <DownOutlined />
      </Button>
      <Modal
        title={
          isManageCustomToken ? (
            <div>{manageCustomeTokenTitle}</div>
          ) : (
            <div>Select A Token</div>
          )
        }
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        // allows us to edit the bottom component (i.e. the OK and Cancel)
        footer={null}
        bodyStyle={{ height: '60vh' }}
      >
        {isManageCustomToken ? (
          <ManageCustomToken />
        ) : (
          // Select a token component
          <div>
            <Input
              placeholder="Search name or paste address"
              size="large"
              prefix={<SearchOutlined />}
              style={{ width: '100%', borderRadius: '10px' }}
            />
            <div>
              <Row justify="space-evenly">
                <Button
                  style={{ padding: '0', width: '70px' }}
                  onClick={() => {
                    chooseAssetHandler()
                  }}
                >
                  <IconComponent
                    imgUrl={
                      'https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880'
                    }
                  />
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
                {getCombinedListOfAssets('eth').map((i) => (
                  <SelectAssetItem
                    icon={<IconComponent imgUrl={i.imgUrl} />}
                    symbol={i.symbol}
                    name={i.name}
                    balance={i.bal}
                    isDefaultAsset={i.isDefaultAsset}
                    onClickHandler={chooseAssetHandler}
                    address={i.address}
                    key={i.symbol}
                    index={props.index}
                    type={props.type}
                    amount={props.amount}
                  />
                ))}
              </div>
            </div>
            <hr />
            <div>
              <Button
                block
                shape="round"
                onClick={() => {
                  setIsManageCustomToken(true)
                }}
              >
                Manage Custom Token Addresses
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

const mapStateToProps = ({ customTokenReducer }, ownProps) => ({
  ethCustomTokens: customTokenReducer.eth,
  props: ownProps,
})

export default connect(mapStateToProps)(SelectAssetModal)
