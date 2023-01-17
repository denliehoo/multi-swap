import classes from './SelectAssetModal.module.css'
import { Row, Col } from 'antd/lib/grid'
import {
  ArrowLeftOutlined,
  DownOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { Button, Modal, Input } from 'antd'
import React, { useEffect, useState } from 'react'
import SelectAssetItem from './SelectAssetItem'
import IconComponent from '../shared/IconComponent'
import ManageCustomToken from './ManageCustomToken'
import { ethDefaultAssetInfo } from '../../../utils/ethDefaultAssetInfo'
import { ftmDefaultAssetInfo } from '../../../utils/ftmDefaultAssetInfo'
import { getTokenBalances } from '../../../api/api'
import { connect } from 'react-redux'

const SelectAssetModal = ({
  props,
  ethCustomTokens,
  ftmCustomTokens,
  chain,
  address,
}) => {
  const [selectedAsset, setSelectedAsset] = useState('')
  const [isManageCustomToken, setIsManageCustomToken] = useState(false)
  const [combinedAssetList, setCombinedAssetList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [toggleChangesInCustomToken, setToggleChangesInCustomToken] = useState(
    false,
  )

  useEffect(() => {
    props.isModalOpen && address && getCombinedListOfAssets(chain, address)
  }, [address, props.isModalOpen, toggleChangesInCustomToken])

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

  const getCombinedListOfAssets = async (chain, address) => {
    const defaultAssets = getDefaultAssets(chain)
    const customTokens = getCustomTokens(chain)
    const formattedCustomTokens = customTokens.map((i) => ({
      symbol: i.symbol,
      name: i.name,
      imgUrl: i.logo,
      address: i.address,
      isDefaultAsset: false,
      bal: 123,
      decimals: i.decimals,
    }))
    let combinedAssetListTemp = defaultAssets.concat(formattedCustomTokens)
    const arrayOfAssetAddresses = combinedAssetListTemp.map((i) => i.address)
    const balancesArray = await getTokenBalances(
      chain,
      address,
      arrayOfAssetAddresses,
    )

    for (let i in combinedAssetListTemp) {
      combinedAssetListTemp[i].bal = balancesArray[i]
    }
    setCombinedAssetList(combinedAssetListTemp)
    console.log(combinedAssetListTemp)
    setIsLoading(false)
    return combinedAssetListTemp
  }

  const chooseAssetHandler = (symbol, bal) => {
    //.... choose symbol
    setSelectedAsset(symbol)

    // pass balance to parent
    props.assetHasBeenSelected()
    props.passBalanceToParent(bal)

    // closes the modal
    closeModalHandler()
  }

  const closeModalHandler = () => {
    setIsManageCustomToken(false)
    props.closeModal()
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
      <Modal
        title={
          isManageCustomToken ? (
            <div>{manageCustomeTokenTitle}</div>
          ) : (
            <div>Select A Token</div>
          )
        }
        visible={props.isModalOpen}
        onOk={closeModalHandler}
        onCancel={closeModalHandler}
        // allows us to edit the bottom component (i.e. the OK and Cancel)
        footer={null}
        bodyStyle={{ height: '60vh' }}
      >
        {!address ? (
          <div>Please connect your wallet to continue</div>
        ) : isLoading ? (
          <div>Loading...</div>
        ) : isManageCustomToken ? (
          <ManageCustomToken
            setToggleChangesInCustomToken={() => {
              setToggleChangesInCustomToken(!toggleChangesInCustomToken)
            }}
          />
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
                {combinedAssetList.map((i) => (
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
                    decimals={i.decimals}
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
  address: connectWalletReducer.address,
  props: ownProps,
})

export default connect(mapStateToProps)(SelectAssetModal)
