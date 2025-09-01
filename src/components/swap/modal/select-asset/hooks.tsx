import { getTokenBalances } from '@src/api';
import {
  ethDefaultAssetInfo,
  ftmDefaultAssetInfo,
  sepoliaDefaultAssetInfo,
} from '@src/constants';
import { EBlockchainNetwork } from '@src/enum';
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
  const [isLoading, setIsLoading] = useState(true);
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
      } else if (chain === EBlockchainNetwork.FTM) {
        return ftmCustomTokens;
      } else if (chain === EBlockchainNetwork.SEPOLIA) {
        return sepoliaCustomTokens;
      }
      return sepoliaCustomTokens;
    },
    [ethCustomTokens, ftmCustomTokens, sepoliaCustomTokens],
  );

  const getDefaultAssets = useCallback((chain: EBlockchainNetwork) => {
    if (chain === EBlockchainNetwork.ETH) {
      return ethDefaultAssetInfo;
    } else if (chain === EBlockchainNetwork.FTM) {
      return ftmDefaultAssetInfo;
    } else if (chain === EBlockchainNetwork.SEPOLIA) {
      return sepoliaDefaultAssetInfo;
    }
    return [];
  }, []);

  const getCombinedListOfAssets = useCallback(
    async (chain: EBlockchainNetwork, address: string) => {
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
      let combinedAssetListTemp = defaultAssets.concat(formattedCustomTokens);
      const arrayOfAssetAddresses = combinedAssetListTemp.map((i) => i.address);
      // Refactor to use the tanstack hook instead. Furthermore, should only use the hook when needed (e.g. when we open the modal), definitely need to refactor this entire component as it is getting too big
      const data = await getTokenBalances(
        chain,
        address,
        arrayOfAssetAddresses,
      );

      const balancesArray = data.balances;

      for (let i in combinedAssetListTemp) {
        combinedAssetListTemp[i].bal = balancesArray[i];
      }
      setCombinedAssetList(combinedAssetListTemp);
      setIsLoading(false);
      return combinedAssetListTemp;
    },
    [getDefaultAssets, getCustomTokens],
  );

  const chooseAssetHandler = (bal: number) => {
    assetHasBeenSelected();
    passBalanceToParent(bal);
    closeModalHandler();
  };

  const closeModalHandler = () => {
    setIsManageCustomToken(false);
    setCombinedAssetList([]);
    setIsLoading(true);
    setToggleChangesInCustomToken(false);
    setSearchInput('');
    setSearchInputResults([]);

    closeModal();
  };

  useEffect(() => {
    if (isModalOpen && address) {
      getCombinedListOfAssets(chain, address);
    }
  }, [
    address,
    chain,
    getCombinedListOfAssets,
    isModalOpen,
    toggleChangesInCustomToken,
  ]);

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
