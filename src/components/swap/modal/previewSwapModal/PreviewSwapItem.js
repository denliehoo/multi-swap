import IconComponent from '../../shared/IconComponent'
import { Row, Col } from 'antd'
const PreviewSwapItem = (props) => {
  return (
    <div style={{marginTop: '10px' , paddingRight: '15px', paddingTop: '5px'}}>
      <Row justify="space-between">
        <Row align="middle" >
          <IconComponent size={40} imgUrl={props.imgUrl} />
          <span className='ml-10'>{props.symbol}</span>
        </Row>
        <Row align="middle" >
          <Col>
            <Row justify="end" className='fs-xs'>${props.amount * props.price}</Row>
            <Row justify="end">{props.amount}</Row>
          </Col>
        </Row>
      </Row>
    </div>
  )
}

export default PreviewSwapItem
