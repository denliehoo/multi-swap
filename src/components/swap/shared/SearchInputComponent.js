// import { SearchOutlined } from '@ant-design/icons'
// import { useState } from 'react'
// import { Input } from 'antd'
// const SearchInputComponent = (props) => {
//   const [searchInput, setSearchInput] = useState('')
//   const [searchInputResults, setSearchInputResults] = useState([])

//   const changeSearchInputHandler = (e) => {
//     setSearchInput(e.target.value)
//     const userInput = e.target.value.toLowerCase()

//     const filteredResults = props.combinedAssetList.filter(
//       (asset) =>
//         asset.symbol.toLowerCase().includes(userInput) ||
//         asset.name.toLowerCase().includes(userInput) ||
//         (userInput.length > 20 &&
//           asset.address.toLowerCase().includes(userInput)),
//     )
//     console.log(filteredResults)
//     setSearchInputResults(filteredResults)
//   }

//   return (
//     <Input
//       placeholder="Search name or paste address"
//       size="large"
//       prefix={<SearchOutlined />}
//       className="class-name-custom-ant-input"
//       value={searchInput}
//       onChange={changeSearchInputHandler}
//     />
//   )
// }

// export default SearchInputComponent
