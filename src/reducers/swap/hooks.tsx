import { RootState } from "@src/store";
import { useDispatch, useSelector } from "react-redux";
import { ISwapDetails } from "./interface";
import {
  addSwapFrom,
  removeSwapFrom,
  addSwapTo,
  removeSwapTo,
  resetSwap,
} from "./reducer";

export const useSwapDispatch = () => {
  const dispatch = useDispatch();
  const addSwapFromAction = (swapFrom: ISwapDetails[]) =>
    dispatch(addSwapFrom(swapFrom));
  const removeSwapFromAction = (swapFrom: ISwapDetails[]) =>
    dispatch(removeSwapFrom(swapFrom));
  const addSwapToAction = (swapTo: ISwapDetails[]) =>
    dispatch(addSwapTo(swapTo));
  const removeSwapToAction = (swapTo: ISwapDetails[]) =>
    dispatch(removeSwapTo(swapTo));
  const resetSwapAction = () => dispatch(resetSwap());
  return {
    addSwapFromAction,
    removeSwapFromAction,
    addSwapToAction,
    removeSwapToAction,
    resetSwapAction,
  };
};

export const useSwapState = () => {
  return useSelector((state: RootState) => state.swapReducer);
};
