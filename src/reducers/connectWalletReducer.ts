import Web3 from "web3";
// import from truffle_abis if deployed through truffle
// import Multiswap from '../truffle_abis/Multiswap.json'

// import from utils if deployed through remix
// import Multiswap from '../utils/deployedContractsABI/goerliABI.json'
// import Multiswap from '../utils/deployedContractsABI/ftmABI.json'
import Multiswap_goerli from "../utils/deployedContractsABI/phase2/goerliABI.json";
import Multiswap_ftm from "../utils/deployedContractsABI/phase2/ftmABI.json";
import { MULTISWAP_ADDRESS } from "../config/config";
import { EBlockchainNetwork } from "../enum";

// config for chain ids
const chainIds: Record<EBlockchainNetwork, string> = {
  [EBlockchainNetwork.ETH]: "0x1",
  [EBlockchainNetwork.FTM]: "0xFA",
  [EBlockchainNetwork.GOERLI]: "0x5",
};

const multiswapAbi: any = {
  goerli: Multiswap_goerli,
  ftm: Multiswap_ftm,
};

const chainConfig: any = {
  //eth:
  // goerli:
  [EBlockchainNetwork.FTM]: {
    chainId: "0xFA",
    chainName: "Fantom",
    rpcUrls: ["https://rpc.ankr.com/fantom"],
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18,
    },
    blockExplorerUrls: ["https://ftmscan.com"],
  },
};

interface IConnectWalletProps {
  address: string;
  walletConnected: boolean;
  chain: EBlockchainNetwork;
  multiswap: any;
  web3: any;
}
const initialState: IConnectWalletProps = {
  address: "",
  walletConnected: false,
  chain: EBlockchainNetwork.FTM,
  // chain: 'goerli',
  // chain: 'eth'
  multiswap: {},
  web3: {},
};

enum EWalletAction {
  CONNECT_WALLET = "CONNECT_WALLET",
  CHANGE_WALLET = "CHANGE_WALLET",
  DISCONNECT_WALLET = "DISCONNECT_WALLET",
  CONNECT_SMART_CONTRACT = "CONNECT_SMART_CONTRACT",
  CHANGE_CHAIN = "CHANGE_CHAIN",
}

// actions here
const connectWalletAction = (payload: { address: string; web3: any }) => ({
  type: EWalletAction.CONNECT_WALLET,
  payload,
});

const changeWalletAction = (payload: string) => ({
  type: EWalletAction.CHANGE_WALLET,
  payload,
});

const disconnectWalletAction = () => ({
  type: EWalletAction.DISCONNECT_WALLET,
});

const connectSmartContractAction = (payload: any) => ({
  type: EWalletAction.CONNECT_SMART_CONTRACT,
  payload,
});

const changeChainConnectWalletReducer = (payload: EBlockchainNetwork) => ({
  type: EWalletAction.CHANGE_CHAIN,
  payload,
});

const attemptToConnectWallet = (chain: EBlockchainNetwork): any => {
  return async (dispatch: any) => {
    ///
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      const web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId(); // int type

      let onCorrectChain = true;
      // if network id not equal to the goerli, attempt to change chain
      // if connect to ganache instead, think just hardcode chainIds[chain] to that of ganache instead
      if (web3.utils.toHex(networkId) !== chainIds[chain]) {
        // attempt to connect
        onCorrectChain = await attemptToChangeChain(chain);
        if (!onCorrectChain) {
          dispatch(disconnectWalletAction());
          return false;
        }
      }
      await dispatch(connectWalletAction({ address: accounts[0], web3: web3 }));

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
          // '0x743EaA47beaC140B1ff8d7b14C92A757A0dFAbF4', // Goerli
          // '0x4e604887d397BB75e064522223c0D56CDD92E990', // FTM
          // '0x6aD14F3770bb85a35706DCa781E003Fcf1e716e3' // phase 2 goerli
          MULTISWAP_ADDRESS[chain]
        );
        // ******

        console.log(multiswap.methods);
        dispatch(connectSmartContractAction(multiswap));
        return true;
      } else {
        // if no network...
        console.log("Error: Wrong chain or no network detected");
        dispatch(disconnectWalletAction());
        return false;
      }
    } catch (error) {
      console.log(error);
      dispatch(disconnectWalletAction());
      return false;
    }

    ///
  };
};

const attemptToChangeChain = async (chain: EBlockchainNetwork) => {
  // try to switch, if can't switch (either because user reject or dont have the chain id), then will give error
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIds[chain] }],
    });
    return true;
  } catch {
    // if user dont have the chain then we add it
    try {
      const results = await window.ethereum.request({
        jsonrpc: "2.0",
        method: "wallet_addEthereumChain",
        params: [chainConfig[chain]],
        id: 0,
      });

      if (!results) return false;
      return true;
    } catch {
      console.log("User rejected");
      return false;
      // maybe change address here or something to unsupported? Will this cause any problems?
    }
  }
};

// reducer here
const connectWalletReducer = (
  state = initialState,
  action: { type: EWalletAction; payload: any }
) => {
  switch (action.type) {
    case EWalletAction.CONNECT_WALLET:
      return {
        ...state,
        address: action.payload.address,
        web3: action.payload.web3,
        walletConnected: true,
      };
    case EWalletAction.CHANGE_WALLET:
      return { ...state, address: action.payload, walletConnected: true };
    case EWalletAction.DISCONNECT_WALLET:
      return { ...state, address: "", walletConnected: false, multiswap: {} };
    case EWalletAction.CONNECT_SMART_CONTRACT:
      return { ...state, multiswap: action.payload };
    case EWalletAction.CHANGE_CHAIN:
      return { ...state, chain: action.payload };
    default:
      return state;
  }
};

export {
  connectWalletReducer,
  connectWalletAction,
  changeWalletAction,
  disconnectWalletAction,
  connectSmartContractAction,
  attemptToConnectWallet,
  changeChainConnectWalletReducer,
};
