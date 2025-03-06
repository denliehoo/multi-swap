import { ISwapDetails } from "@src/reducers/swap";

export const validatePercentageArray = (
  swapToPercentages: number[],
  setShowPercentageError: (value: boolean) => void
): boolean => {
  const arrayHasZero = swapToPercentages.includes(0);
  const sumOfArray = swapToPercentages.reduce(
    (partialSum, a) => partialSum + a,
    0
  );
  const valid = arrayHasZero || sumOfArray !== 100 ? false : true;
  if (!valid) {
    setShowPercentageError(true);
  }
  return valid;
};

export const validateTokenSelected = (
  swapTo: ISwapDetails[],
  swapFrom: ISwapDetails[],
  setShowTokenNotSelectedError: (value: boolean) => void
): boolean => {
  const swapToSymbols = swapTo.map((i) => i.symbol);
  const swapFromSymbols = swapFrom.map((i) => i.symbol);
  const valid =
    swapToSymbols.includes("") || swapFromSymbols.includes("") ? false : true;
  if (!valid) {
    setShowTokenNotSelectedError(true);
  }
  return valid;
};

export const validateAmount = (
  swapFrom: ISwapDetails[],
  setShowAmountError: (value: boolean) => void
): boolean => {
  // By default an empty input will give an empty string. Convert it to 0
  const swapFromAmount = swapFrom.map((i) => i.amount || 0);
  const arrayContainsNaN = (arr: number[]) => {
    let results = false;
    for (let i in arr) {
      if (!arr[i]) {
        results = true;
      }
    }
    return results;
  };
  const valid =
    swapFromAmount.includes(0) || arrayContainsNaN(swapFromAmount)
      ? false
      : true;
  if (!valid) {
    setShowAmountError(true);
  }
  return valid;
};

export const validateAmountLesserThanBalance = (
  swapFrom: ISwapDetails[],
  setShowAmountGreaterThanBalanceError: (value: boolean) => void
): boolean => {
  const swapFromAmount = swapFrom.map((i) => i.amount);
  const swapFromBalance = swapFrom.map((i) => i.balance);

  let valid = true;
  for (let i in swapFrom) {
    if (swapFromAmount[i] > swapFromBalance[i]) {
      valid = false;
      setShowAmountGreaterThanBalanceError(true);
      break;
    }
  }
  return valid;
};
