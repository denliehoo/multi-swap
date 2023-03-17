import classes from './SelectAssetModal.module.css'
import { Row, Col } from 'antd/lib/grid'
import { ArrowLeftOutlined, LoadingOutlined } from '@ant-design/icons'
import { Button, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import SelectAssetItem from './SelectAssetItem'
import IconComponent from '../../shared/IconComponent'
import ManageCustomToken from '../manageCustomTokenModal/ManageCustomToken'
import { ethDefaultAssetInfo } from '../../../../utils/ethDefaultAssetInfo'
import { ftmDefaultAssetInfo } from '../../../../utils/ftmDefaultAssetInfo'
import { goerliDefaultAssetInfo } from '../../../../utils/goerliDefaultAssetInfo'
import { getTokenBalances } from '../../../../api/api'
import { connect } from 'react-redux'
import { useWindowSize } from '../../../../hooks/useWindowSize'
import SearchInputComponent from '../../shared/SearchInputComponent'

const SelectAssetModal = ({
  props,
  ethCustomTokens,
  ftmCustomTokens,
  goerliCustomTokens,
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
  const [searchInput, setSearchInput] = useState('')
  const [searchInputResults, setSearchInputResults] = useState([])
  const { width } = useWindowSize()

  useEffect(() => {
    props.isModalOpen && address && getCombinedListOfAssets(chain, address)
  }, [address, props.isModalOpen, toggleChangesInCustomToken])

  const getCustomTokens = (chain) => {
    if (chain === 'eth') {
      return ethCustomTokens
    } else if (chain === 'ftm') {
      return ftmCustomTokens
    } else if (chain === 'goerli') {
      return goerliCustomTokens
    }
  }

  const getDefaultAssets = (chain) => {
    if (chain === 'eth') {
      return ethDefaultAssetInfo
    } else if (chain === 'ftm') {
      return ftmDefaultAssetInfo
    } else if (chain === 'goerli') {
      return goerliDefaultAssetInfo
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
    // props.type === 'from' ? setCombinedAssetList([combinedAssetListTemp[0]]) : setCombinedAssetList(combinedAssetListTemp)
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
    setSelectedAsset('')
    setIsManageCustomToken(false)
    setCombinedAssetList([])
    setIsLoading(true)
    setToggleChangesInCustomToken(false)
    setSearchInput('')
    setSearchInputResults([])

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
      <Col span={8}>Manage</Col>
      <Col span={6} />
    </Row>
  )

  const commonTokens = (
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
        destroyOnClose={true}
        // allows us to edit the bottom component (i.e. the OK and Cancel)
        footer={null}
      >
        {!address ? (
          <div>Please connect your wallet to continue</div>
        ) : isLoading ? (
          <Row align="middle" justify="center">
            <LoadingOutlined style={{ fontSize: '128px' }} />{' '}
          </Row>
        ) : isManageCustomToken ? (
          <ManageCustomToken
            setToggleChangesInCustomToken={() => {
              setToggleChangesInCustomToken(!toggleChangesInCustomToken)
            }}
          />
        ) : (
          // Select a token component
          <div>
            <SearchInputComponent
              itemToFilter={combinedAssetList}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              setSearchInputResults={setSearchInputResults}
            />
            {/* {commonTokens} */}
            <div>
              <div className={classes.selectAssetsContainer}>
                {(searchInput ? searchInputResults : combinedAssetList).map(
                  (i) => (
                    <SelectAssetItem
                      icon={<IconComponent 
                      // size={ width > 480 ? 32 : width > 420 ? 28 : width > 360 ? 24 : 20} 
                      imgUrl={i.imgUrl} />}
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
                      imgUrl={i.imgUrl}
                    />
                  ),
                )}
                {searchInput && searchInputResults.length === 0 && (
                  <div>Search result in no tokens found</div>
                )}
              </div>
            </div>
            {/* <hr /> */}
            <div>
              <Button
                block
                shape="round"
                type="primary"
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
  goerliCustomTokens: customTokenReducer.goerli,
  chain: connectWalletReducer.chain,
  address: connectWalletReducer.address,
  props: ownProps,
})

export default connect(mapStateToProps)(SelectAssetModal)
