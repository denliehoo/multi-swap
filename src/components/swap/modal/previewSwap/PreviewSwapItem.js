const PreviewSwapItem = (props) => {
  return (
    <div>
      {props.amount} {props.symbol}
      <div>${props.amount*props.price}</div>
    </div>
  )
}

export default PreviewSwapItem
