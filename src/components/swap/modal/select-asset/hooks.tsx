import {
  ethDefaultAssetInfo,
  ftmDefaultAssetInfo,
  sepoliaDefaultAssetInfo,
} from '@src/constants';
import { EBlockchainNetwork } from '@src/enum';
import { useTokenBalances } from '@src/hooks/query/use-token-balances';
import { IDefaultAssetInfo } from '@src/interface';
import { useConnectWalletState } from '@src/reducers/connect-wallet';
import { useCustomTokenState, ICustomToken } from '@src/reducers/custom-token';
import { useCallback, useEffect, useState } from 'react';

interface IUseSelectAssetModalProps {
  assetHasBeenSelected: () => void;
  passBalanceToParent: (balance: number) => void;
  closeModal: () => void;
  isModalOpen: boolean;
}

export const useSelectAssetModal = ({
  assetHasBeenSelected,
  passBalanceToParent,
  closeModal,
  isModalOpen,
}: IUseSelectAssetModalProps) => {
  const {
    eth: ethCustomTokens,
    ftm: ftmCustomTokens,
    sepolia: sepoliaCustomTokens,
  } = useCustomTokenState();
  const { chain, address } = useConnectWalletState();

  const [isManageCustomToken, setIsManageCustomToken] = useState(false);
  const [combinedAssetList, setCombinedAssetList] = useState<
    IDefaultAssetInfo[]
  >([]);
  const [toggleChangesInCustomToken, setToggleChangesInCustomToken] =
    useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchInputResults, setSearchInputResults] = useState<
    IDefaultAssetInfo[]
  >([]);

  const getCustomTokens = useCallback(
    (chain: EBlockchainNetwork) => {
      if (chain === EBlockchainNetwork.ETH) {
        return ethCustomTokens;
      }
      if (chain === EBlockchainNetwork.FTM) {
        return ftmCustomTokens;
      }
      if (chain === EBlockchainNetwork.SEPOLIA) {
        return sepoliaCustomTokens;
      }
      return sepoliaCustomTokens;
    },
    [ethCustomTokens, ftmCustomTokens, sepoliaCustomTokens],
  );

  const getDefaultAssets = useCallback((chain: EBlockchainNetwork) => {
    if (chain === EBlockchainNetwork.ETH) {
      return ethDefaultAssetInfo;
    }
    if (chain === EBlockchainNetwork.FTM) {
      return ftmDefaultAssetInfo;
    }
    if (chain === EBlockchainNetwork.SEPOLIA) {
      return sepoliaDefaultAssetInfo;
    }
    return [];
  }, []);

  const defaultAssets = getDefaultAssets(chain);
  const customTokens = getCustomTokens(chain) as ICustomToken[];
  const formattedCustomTokens = customTokens.map((i) => ({
    symbol: i.symbol,
    name: i.name,
    imgUrl: i.logo,
    address: i.address,
    isDefaultAsset: false,
    bal: 0,
    decimals: i.decimals,
  }));
  const combinedAssets = defaultAssets.concat(formattedCustomTokens);
  const arrayOfAssetAddresses = combinedAssets.map((i) => i.address);

  const { data, isLoading } = useTokenBalances(
    chain,
    address,
    arrayOfAssetAddresses,
  );

  const chooseAssetHandler = (bal: number) => {
    assetHasBeenSelected();
    passBalanceToParent(bal);
    closeModalHandler();
  };

  const closeModalHandler = () => {
    setIsManageCustomToken(false);
    setCombinedAssetList([]);
    setToggleChangesInCustomToken(false);
    setSearchInput('');
    setSearchInputResults([]);

    closeModal();
  };

  useEffect(() => {
    if (isModalOpen && address && data && data.balances) {
      const balancesArray = data.balances;
      const updatedAssets = combinedAssets.map((asset, idx) => ({
        ...asset,
        bal: balancesArray[idx],
      }));
      setCombinedAssetList(updatedAssets);
    }
  }, [isModalOpen, address, data, combinedAssets]);

  return {
    setIsManageCustomToken,
    isManageCustomToken,
    closeModalHandler,
    address,
    isLoading,
    getDefaultAssets,
    setToggleChangesInCustomToken,
    toggleChangesInCustomToken,
    combinedAssetList,
    searchInput,
    setSearchInput,
    setSearchInputResults,
    searchInputResults,
    chooseAssetHandler,
    chain,
  };
};
