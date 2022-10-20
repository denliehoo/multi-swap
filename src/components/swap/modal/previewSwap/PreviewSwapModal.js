import { Button, Modal, Row, Col } from 'antd'
import { useEffect, useState } from 'react'
import PreviewSwapItem from './PreviewSwapItem'

import { connect } from 'react-redux'

const PreviewSwapModal = ({ props, swapFrom, swapTo }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [swapFromDetails, setSwapFromDetails] = useState()
  const [swapToDetails, setSwapToDetails] = useState()

  // change this eventually
  const getAmountsOutDetails = async () => {
    let swapFromDetailsTemp = swapFrom.map((i) => ({
      amount: i.amount,
      symbol: i.symbol,
    }))
    let swapToDetailsTemp = swapTo.map((i) => ({
      amount: i.amount,
      symbol: i.symbol,
    }))
    const callContractAndReplaceAmount = () => {
      const amountFromContract = '10' // use the smart contract for this
      // replaces the amount; much more code needed here
      for (let i of swapToDetailsTemp) {
        i.amount = amountFromContract
      }
      setSwapFromDetails(swapFromDetailsTemp)
      setSwapToDetails(swapToDetailsTemp)
      setIsLoading(false)
    }
    setTimeout(callContractAndReplaceAmount, 1500)
  }

  const initiateSwap = () => {
    console.log('swap!')
    console.log(swapFromDetails)
    console.log(swapToDetails)
  }

  useEffect(() => {
    getAmountsOutDetails()
  }, [])
  return (
    <Modal
      title={'Preview Swap'}
      visible={props.visible}
      onCancel={props.closePreviewAssetModal}
      // allows us to edit the bottom component (i.e. the OK and Cancel)
      footer={null}
      bodyStyle={{ height: '60vh' }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <div style={{ overflow: 'auto', height: '50vh' }}>
            <Row>You Give</Row>
            {swapFromDetails.map((i, index) => (
              <PreviewSwapItem
                amount={i.amount}
                symbol={i.symbol}
                key={`${index}previewSwapFrom`}
              />
            ))}
            <Row>You Get</Row>
            {!isLoading &&
              swapToDetails.map((i, index) => (
                <PreviewSwapItem
                  amount={i.amount}
                  symbol={i.symbol}
                  key={`${index}previewSwapTo`}
                />
              ))}
          </div>
          <Button
            onClick={() => {
              initiateSwap()
              props.closePreviewAssetModal()
            }}
          >
            Confirm
          </Button>
        </div>
      )}
    </Modal>
  )
}

const mapStateToProps = ({ swapReducer }, ownProps) => ({
  swapFrom: swapReducer.swapFrom,
  swapTo: swapReducer.swapTo,
  props: ownProps,
})

export default connect(mapStateToProps)(PreviewSwapModal)
