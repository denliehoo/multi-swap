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
import { useCallback } from "react";

export const useSwapDispatch = () => {
  const dispatch = useDispatch();

  const addSwapFromAction = useCallback(
    (swapFrom: ISwapDetails[]) => dispatch(addSwapFrom(swapFrom)),
    [dispatch]
  );

  const removeSwapFromAction = useCallback(
    (swapFrom: ISwapDetails[]) => dispatch(removeSwapFrom(swapFrom)),
    [dispatch]
  );

  const addSwapToAction = useCallback(
    (swapTo: ISwapDetails[]) => dispatch(addSwapTo(swapTo)),
    [dispatch]
  );

  const removeSwapToAction = useCallback(
    (swapTo: ISwapDetails[]) => dispatch(removeSwapTo(swapTo)),
    [dispatch]
  );

  const resetSwapAction = useCallback(() => dispatch(resetSwap()), [dispatch]);

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
