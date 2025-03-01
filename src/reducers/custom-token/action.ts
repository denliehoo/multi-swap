import { EBlockchainNetwork } from "../../enum";
import { ICustomToken } from "./interface";

export enum ECustomTokenAction {
  ADD_CUSTOM_TOKEN = "ADD_CUSTOM_TOKEN",
  REMOVE_CUSTOM_TOKEN = "REMOVE_CUSTOM_TOKEN",
  REMOVE_ALL_CUSTOM_TOKEN = "REMOVE_ALL_CUSTOM_TOKEN",
  CHANGE_CHAIN = "CHANGE_CHAIN",
}

export const addCustomToken = (payload: ICustomToken[]) => ({
  type: ECustomTokenAction.ADD_CUSTOM_TOKEN,
  payload,
});

export const removeCustomToken = (payload: ICustomToken) => ({
  type: ECustomTokenAction.REMOVE_CUSTOM_TOKEN,
  payload,
});
export const removeAllCustomToken = () => ({
  type: ECustomTokenAction.REMOVE_ALL_CUSTOM_TOKEN,
});

export const changeChainCustomTokenReducer = (payload: EBlockchainNetwork) => ({
  type: ECustomTokenAction.CHANGE_CHAIN,
  payload,
});
