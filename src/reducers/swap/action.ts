import { ISwapDetails } from "./interface";

// actions
export const addSwapFrom = (payload: ISwapDetails[]) => ({
  type: "ADD_SWAP_FROM",
  payload,
});
export const removeSwapFrom = (payload: ISwapDetails) => ({
  type: "REMOVE_SWAP_FROM",
  payload,
});
export const addSwapTo = (payload: ISwapDetails[]) => ({
  type: "ADD_SWAP_TO",
  payload,
});
export const removeSwapTo = (payload: ISwapDetails) => ({
  type: "REMOVE_SWAP_TO",
  payload,
});
export const resetSwap = () => ({
  type: "RESET_SWAP",
});
