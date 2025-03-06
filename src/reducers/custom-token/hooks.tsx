import { useDispatch, useSelector } from "react-redux";
import { ICustomToken } from "./interface";
import {
  addCustomToken,
  changeChainCustomToken,
  removeAllCustomToken,
  removeCustomToken,
} from "./reducer";
import { RootState } from "@src/store";
import { EBlockchainNetwork } from "@src/enum";

export const useCustomTokenDispatch = () => {
  const dispatch = useDispatch();

  const addCustomTokenAction = (token: ICustomToken[]) =>
    dispatch(addCustomToken(token));

  const removeCustomTokenAction = (token: ICustomToken[]) =>
    dispatch(removeCustomToken(token));

  const removeAllCustomTokenAction = () => dispatch(removeAllCustomToken());

  const changeChainCustomTokenReducer = (chain: EBlockchainNetwork) =>
    dispatch(changeChainCustomToken(chain));

  return {
    addCustomTokenAction,
    removeCustomTokenAction,
    removeAllCustomTokenAction,
    changeChainCustomTokenReducer,
  };
};

export const useCustomTokenState = () => {
  return useSelector((state: RootState) => state.customTokenReducer);
};
