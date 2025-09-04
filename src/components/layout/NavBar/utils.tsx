'use client';
import { EBlockchainNetwork } from '@src/enum';

import ConnectWalletPopup from '@src/components/shared/ConnectWalletPopup';
import {
  BLOCK_NETWORK_NAME_MAPPING,
  BLOCKCHAIN_NETWORK_LOGO_MAPPING,
} from '@src/constants';
import { shortenAddress } from '@src/utils/format/string';
import IconComponent from '@src/components/shared/IconComponent';

const renderNetworkLabel = (
  chain: EBlockchainNetwork,
  _isHeader: boolean,
  handleNetworkChange: (chain: EBlockchainNetwork) => void,
) => {
  const chainLogo = BLOCKCHAIN_NETWORK_LOGO_MAPPING[chain];
  const chainName = BLOCK_NETWORK_NAME_MAPPING[chain];

  if (!_isHeader) {
    return {
      label: (
        <span onClick={() => handleNetworkChange(chain)}>
          <IconComponent imgUrl={chainLogo} size={'small'} /> {chainName}
        </span>
      ),
      key: chainName,
    };
  }
  return (
    <span>
      <IconComponent imgUrl={chainLogo} size={'small'} /> {chainName}
    </span>
  );
};

export const getNetworkPortion = (
  chain: EBlockchainNetwork,
  handleNetworkChange: (chain: EBlockchainNetwork) => Promise<void>,
  remainingChains: EBlockchainNetwork[],
) => {
  return {
    label: renderNetworkLabel(chain, true, handleNetworkChange),
    key: 'networkName',
    children: remainingChains.map((c) =>
      renderNetworkLabel(c, false, handleNetworkChange),
    ),
  };
};

export const getWalletConnectPortion = (
  walletConnected: boolean,
  address: string,
  connectWalletHandler: () => void,
  disconnectWalletAction: () => void,
) => {
  const shortenedAddress = shortenAddress(address);

  const addressOrConnectButton = (
    <span>
      {shortenedAddress ? (
        <span>{shortenedAddress}</span>
      ) : typeof window !== 'undefined' && window.ethereum ? (
        <span onClick={connectWalletHandler}>Connect Wallet</span>
      ) : (
        <ConnectWalletPopup placement="bottom" />
      )}
    </span>
  );

  return walletConnected && address
    ? {
        label: addressOrConnectButton,
        key: 'connectWallet',
        children: [
          {
            label: <div onClick={disconnectWalletAction}>Disconnect</div>,
            key: 'disconnectWallet',
          },
        ],
      }
    : { label: addressOrConnectButton, key: 'connectWallet' };
};
