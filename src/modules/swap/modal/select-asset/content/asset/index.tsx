import SelectAssetItem from './asset-item';
import classes from './index.module.css';

import { Button } from 'antd';
import { FC } from 'react';
import { IDefaultAssetInfo } from '@src/interface';
import { ESWapDirection } from '@src/enum';
import IconComponent from '@src/components/shared/IconComponent';
import TokenSearchInput from '@src/modules/swap/token-search-input';

interface ISelectAssetModalContentAsset {
  combinedAssetList: IDefaultAssetInfo[];
  searchInput: string;
  setSearchInput: (input: string) => void;
  setSearchInputResults: (results: IDefaultAssetInfo[]) => void;
  searchInputResults: IDefaultAssetInfo[];
  index: number;
  type: ESWapDirection;
  amount: number;
  setIsManageCustomToken: (value: boolean) => void;
  chooseAssetHandler: (bal: number) => void;
}

const SelectAssetModalContentAsset: FC<ISelectAssetModalContentAsset> = ({
  combinedAssetList,
  searchInput,
  setSearchInput,
  setSearchInputResults,
  searchInputResults,
  index,
  type,
  amount,
  setIsManageCustomToken,
  chooseAssetHandler,
}) => {
  return (
    <div>
      <TokenSearchInput
        itemToFilter={combinedAssetList}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        setSearchInputResults={setSearchInputResults}
      />
      {/* {commonTokens} */}
      <div>
        <div className={classes.selectAssetsContainer}>
          {(searchInput ? searchInputResults : combinedAssetList).map((i) => (
            <SelectAssetItem
              icon={<IconComponent imgUrl={i.imgUrl} />}
              symbol={i.symbol}
              name={i.name}
              bal={i.bal}
              isDefaultAsset={i.isDefaultAsset}
              imgUrl={i.imgUrl}
              decimals={i.decimals}
              address={i.address}
              index={index}
              type={type}
              amount={amount}
              onClickHandler={chooseAssetHandler}
              key={i.symbol}
            />
          ))}
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
            setIsManageCustomToken(true);
          }}
        >
          Manage Custom Token Addresses
        </Button>
      </div>
    </div>
  );
};

export default SelectAssetModalContentAsset;
