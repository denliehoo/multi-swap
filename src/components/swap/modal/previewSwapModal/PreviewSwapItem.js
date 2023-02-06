import IconComponent from '../../shared/IconComponent'
import { Row, Col } from 'antd'
import { formatNumber } from '../../../../utils/format/formatNumber'
const PreviewSwapItem = (props) => {
  console.log(props.amount*props.price)
  console.log(typeof props.amount*props.price)
  return (
    <div className='mt-10 pr-15 pt-5'>
      <Row justify="space-between">
        <Row align="middle" >
          <IconComponent size={40} imgUrl={props.imgUrl} />
          <span className='ml-10'>{props.symbol}</span>
        </Row>
        <Row align="middle" >
          <Col>
            <Row justify="end" className='fs-xs'>{formatNumber(props.amount * props.price, 'fiat')}</Row>
            <Row justify="end">{formatNumber(props.amount, 'crypto')}</Row>
          </Col>
        </Row>
      </Row>
    </div>
  )
}

export default PreviewSwapItem
