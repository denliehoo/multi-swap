import { EBlockchainNetwork } from '@src/enum';
import fantomLogo from '@src/assets/images/fantomLogo.svg';
import goerliLogo from '@src/assets/images/goerliLogo.svg';

export const BLOCKCHAIN_NETWORK_LOGO_MAPPING: Record<
  EBlockchainNetwork,
  string
> = {
  [EBlockchainNetwork.GOERLI]: goerliLogo,
  [EBlockchainNetwork.FTM]: fantomLogo,
  [EBlockchainNetwork.ETH]: '',
};

export const BLOCK_NETWORK_NAME_MAPPING: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.GOERLI]: 'Goerli',
  [EBlockchainNetwork.FTM]: 'Fantom',
  [EBlockchainNetwork.ETH]: 'Ethereum',
};
