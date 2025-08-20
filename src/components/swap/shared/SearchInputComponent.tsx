import { SearchOutlined } from '@ant-design/icons';
import { IDefaultAssetInfo } from '@src/interface';
import { Input } from 'antd';
import { ChangeEvent, FC, useState } from 'react';

interface ISearchInputComponent {
  setSearchInput: (input: string) => void;
  searchInput: string;
  setSearchInputResults: (results: IDefaultAssetInfo[]) => void;
  itemToFilter: IDefaultAssetInfo[];
}

const SearchInputComponent: FC<ISearchInputComponent> = ({
  setSearchInput,
  searchInput,
  setSearchInputResults,
  itemToFilter,
}) => {
  const [inputIsFocused, setInputIsFocused] = useState(false);
  const changeSearchInputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    const userInput = e.target.value.toLowerCase();

    const filteredResults = itemToFilter.filter(
      (asset) =>
        asset.symbol.toLowerCase().includes(userInput) ||
        asset.name.toLowerCase().includes(userInput) ||
        (userInput.length > 20 &&
          asset.address.toLowerCase().includes(userInput)),
    );
    setSearchInputResults(filteredResults);
  };

  return (
    <Input
      placeholder="Search name or paste address"
      size="large"
      prefix={<SearchOutlined />}
      className={`class-name-custom-ant-input ${
        inputIsFocused && 'glowing-border'
      }`}
      value={searchInput}
      onChange={changeSearchInputHandler}
      onFocus={() => setInputIsFocused(true)}
      onBlur={() => setInputIsFocused(false)}
    />
  );
};

export default SearchInputComponent;
