import { EBlockchainNetwork } from '@src/enum';

const useNetworkHandler = (
  chain: EBlockchainNetwork,
  remainingChains: EBlockchainNetwork[],
  setRemainingChains: (chains: EBlockchainNetwork[]) => void,
  changeChainCustomTokenReducer: (chain: EBlockchainNetwork) => void,
  changeChainConnectWalletReducer: (chain: EBlockchainNetwork) => void,
  attemptToConnectWallet: (chain: EBlockchainNetwork) => Promise<Boolean>,
) => {
  const handleNetworkChange = async (_chain: EBlockchainNetwork) => {
    let networkChanged = await attemptToConnectWallet(_chain);
    if (networkChanged) {
      let newRemainingChain = remainingChains.filter((c) => c !== _chain);
      newRemainingChain.push(chain);
      setRemainingChains(newRemainingChain);
      changeChainCustomTokenReducer(_chain);
      changeChainConnectWalletReducer(_chain);
    } else {
      console.log('Network failed to change');
    }
  };

  return { handleNetworkChange };
};

export default useNetworkHandler;
