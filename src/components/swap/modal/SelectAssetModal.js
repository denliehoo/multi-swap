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
import { ethDefaultAssetInfo } from '../../../utils/ethDefaultAssetInfo'
import { ftmDefaultAssetInfo } from '../../../utils/ftmDefaultAssetInfo'
import { connect } from 'react-redux'

const SelectAssetModal = ({
  props,
  ethCustomTokens,
  ftmCustomTokens,
  chain,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState('')
  const [isManageCustomToken, setIsManageCustomToken] = useState(false)
  console.log(chain)
  console.log(ftmCustomTokens)
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
    } else if (chain == 'ftm') {
      return ftmCustomTokens
    }
  }

  const getDefaultAssets = (chain) => {
    if (chain == 'eth') {
      return ethDefaultAssetInfo
    } else if (chain === 'ftm') {
      return ftmDefaultAssetInfo
    }
  }

  const getCombinedListOfAssets = (chain) => {
    const defaultAssets = getDefaultAssets(chain)
    const customTokens = getCustomTokens(chain)
    console.log(customTokens)
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
        {/* {selectedAsset ? selectedAsset : <span>Select A Token</span>} */}
        {props.asset ? props.asset : <span>Select A Token</span>}
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
                {getCombinedListOfAssets(chain).map((i) => (
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

const mapStateToProps = (
  { customTokenReducer, connectWalletReducer },
  ownProps,
) => ({
  ethCustomTokens: customTokenReducer.eth,
  ftmCustomTokens: customTokenReducer.ftm,
  chain: connectWalletReducer.chain,
  props: ownProps,
})

export default connect(mapStateToProps)(SelectAssetModal)
