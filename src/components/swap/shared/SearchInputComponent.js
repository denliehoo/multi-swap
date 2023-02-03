import { SearchOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { useState } from 'react'
const SearchInputComponent = (props) => {
  const [inputIsFocused, setInputIsFocused] = useState(false)
  const changeSearchInputHandler = (e) => {
    props.setSearchInput(e.target.value)
    const userInput = e.target.value.toLowerCase()

    const filteredResults = props.itemToFilter.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(userInput) ||
        asset.name.toLowerCase().includes(userInput) ||
        (userInput.length > 20 &&
          asset.address.toLowerCase().includes(userInput)),
    )
    console.log(filteredResults)
    props.setSearchInputResults(filteredResults)
  }

  return (
    <Input
      placeholder="Search name or paste address"
      size="large"
      prefix={<SearchOutlined />}
      className={`class-name-custom-ant-input ${
        inputIsFocused && 'glowing-border'
      }`}
      value={props.searchInput}
      onChange={changeSearchInputHandler}
      onFocus={() => setInputIsFocused(true)}
      onBlur={() => setInputIsFocused(false)}
    />
  )
}

export default SearchInputComponent
