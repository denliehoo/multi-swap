import IconComponent from "../../shared/IconComponent"
const PreviewSwapItem = (props) => {
  return (
    <div>
      <IconComponent imgUrl={props.imgUrl}/>
      {props.amount} {props.symbol}
      <div>${props.amount*props.price}</div>
    </div>
  )
}

export default PreviewSwapItem
