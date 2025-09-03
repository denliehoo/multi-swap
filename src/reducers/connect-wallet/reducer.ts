import Web3 from 'web3';
// import from truffle_abis if deployed through truffle
// import Multiswap from '../truffle_abis/Multiswap.json'

// import from utils if deployed through remix
// import Multiswap from '../utils/deployedContractsABI/goerliABI.json'
// import Multiswap from '../utils/deployedContractsABI/ftmABI.json'
import Multiswap_sepolia from '../../utils/deployedContractsABI/phase2/sepoliaABI.json';
import Multiswap_ftm from '../../utils/deployedContractsABI/phase2/ftmABI.json';
import { MULTISWAP_ADDRESS } from '../../config';
import { EBlockchainNetwork } from '../../enum';
import { IConnectWalletState } from './interface';
import { Dispatch } from 'redux';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IWeb3 } from '@src/interface';

// config for chain ids
const chainIds: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.ETH]: '0x1',
  [EBlockchainNetwork.FTM]: '0xFA',
  [EBlockchainNetwork.SEPOLIA]: '0xaa36a7',
};

// biome-ignore lint/suspicious/noExplicitAny: <Unable to import AbiItem type>
const multiswapAbi: Record<EBlockchainNetwork, any> = {
  [EBlockchainNetwork.SEPOLIA]: Multiswap_sepolia,
  [EBlockchainNetwork.FTM]: Multiswap_ftm,
  [EBlockchainNetwork.ETH]: undefined,
};

interface IChainConfig {
  chainId: string;
  chainName: string;
  rpcUrls: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorerUrls: string[];
}

const chainConfig: Record<EBlockchainNetwork, IChainConfig | undefined> = {
  [EBlockchainNetwork.FTM]: {
    chainId: '0xFA',
    chainName: 'Fantom',
    rpcUrls: ['https://rpc.ankr.com/fantom'],
    nativeCurrency: {
      name: 'FTM',
      symbol: 'FTM',
      decimals: 18,
    },
    blockExplorerUrls: ['https://ftmscan.com'],
  },
  [EBlockchainNetwork.ETH]: undefined,
  [EBlockchainNetwork.SEPOLIA]: undefined,
};

const initialState: IConnectWalletState = {
  address: '',
  walletConnected: false,
  chain: EBlockchainNetwork.SEPOLIA,
  multiswap: {},
  web3: {},
};

// TODO: Proper typing for web3 and multiswap
export interface IConnectWalletPayload {
  address: string;
  web3: IWeb3;
}

const connectWalletSlice = createSlice({
  name: 'connectWalletReducer',
  initialState,
  reducers: {
    connectWallet(state, action: PayloadAction<IConnectWalletPayload>) {
      state.address = action.payload.address;
      state.web3 = action.payload.web3;
      state.walletConnected = true;
    },
    changeWallet(state, action: PayloadAction<string>) {
      state.address = action.payload;
      state.walletConnected = true;
    },
    disconnectWallet(state) {
      state.address = '';
      state.walletConnected = false;
      state.multiswap = {};
    },
    connectSmartContract(state, action: PayloadAction<object>) {
      state.multiswap = action.payload;
    },
    changeChain(state, action: PayloadAction<EBlockchainNetwork>) {
      state.chain = action.payload;
    },
  },
});
export const {
  connectWallet,
  changeWallet,
  disconnectWallet,
  connectSmartContract,
  changeChain,
} = connectWalletSlice.actions;

export default connectWalletSlice.reducer;

// TODO: Refactor this somewhere else
export const attemptToConnectWallet = (chain: EBlockchainNetwork) => {
  return async (dispatch: Dispatch) => {
    ///
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId(); // int type

      let onCorrectChain = true;
      // if network id not equal to the intended, attempt to change chain
      // if connect to ganache instead, think just hardcode chainIds[chain] to that of ganache instead
      if (web3.utils.toHex(networkId) !== chainIds[chain]) {
        // attempt to connect
        onCorrectChain = await attemptToChangeChain(chain);
        if (!onCorrectChain) {
          dispatch(disconnectWallet());
          return false;
        }
      }
      await dispatch(connectWallet({ address: accounts[0], web3: web3 }));

      // ****** DO NOT DELETE THIS COMMENT
      // This is for if smart contract deployed through truffle
      // load the Multiswap Contract
      /*
      const multiswapData = Multiswap.networks[networkId]
      console.log(multiswapData)
      if (multiswapData) {
        console.log(multiswapData.address)
        const multiswap = new web3.eth.Contract(
          Multiswap.abi,
          multiswapData.address,
        )
      */
      // ******

      // ****** DO NOT DELETE THIS COMMENT
      // This is for if smart contract deployed through remix
      if (onCorrectChain) {
        const multiswap = new web3.eth.Contract(
          multiswapAbi[chain],
          MULTISWAP_ADDRESS[chain],
        );
        // ******

        console.log(multiswap.methods);
        dispatch(connectSmartContract(multiswap));
        return true;
      }
      // if no network...
      console.log('Error: Wrong chain or no network detected');
      dispatch(disconnectWallet());
      return false;
    } catch (error) {
      console.log(error);
      dispatch(disconnectWallet());
      return false;
    }

    ///
  };
};

const attemptToChangeChain = async (chain: EBlockchainNetwork) => {
  // try to switch, if can't switch (either because user reject or dont have the chain id), then will give error
  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainIds[chain] }],
    });
    return true;
  } catch {
    // if user dont have the chain then we add it
    try {
      const results = await window.ethereum.request({
        jsonrpc: '2.0',
        method: 'wallet_addEthereumChain',
        params: [chainConfig[chain]],
        id: 0,
      });

      if (!results) return false;
      return true;
    } catch {
      console.log('User rejected');
      return false;
      // maybe change address here or something to unsupported? Will this cause any problems?
    }
  }
};
