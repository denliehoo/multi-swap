import { EBlockchainNetwork } from '@src/enum';
import fantomLogo from '@src/assets/images/fantomLogo.svg';
import sepoliaLogo from '@src/assets/images/sepoliaLogo.svg';

export const BLOCKCHAIN_NETWORK_LOGO_MAPPING: Record<
  EBlockchainNetwork,
  string
> = {
  [EBlockchainNetwork.SEPOLIA]: sepoliaLogo,
  [EBlockchainNetwork.FTM]: fantomLogo,
  [EBlockchainNetwork.ETH]: '',
};

export const BLOCK_NETWORK_NAME_MAPPING: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.SEPOLIA]: 'Sepolia',
  [EBlockchainNetwork.FTM]: 'Fantom',
  [EBlockchainNetwork.ETH]: 'Ethereum',
};
