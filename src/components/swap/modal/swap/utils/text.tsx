import { formatNumber } from "@src/utils/format/number";
import {
  ESwapEventEmitVariable,
  ESwapType,
  ISwapItemDetails,
  ISwapObject,
} from "..";

import { ScanOutlined } from "@ant-design/icons";
import { ISwapDetails } from "@src/reducers/swap";
import { EBlockchainNetwork } from "@src/enum";

export const getIndividualSwapText = (arr: ISwapItemDetails[]) => {
  let returnString = "";
  if (arr.length > 1) {
    for (let i in arr) {
      if (arr.length - 1 === parseFloat(i)) {
        returnString = returnString.substring(0, returnString.length - 2);
        returnString += ` and ${formatNumber(arr[i].amount, "crypto")} ${
          arr[i].symbol
        }`;
      } else {
        returnString += `${formatNumber(arr[i].amount, "crypto")} ${
          arr[i].symbol
        }, `;
      }
    }
  } else {
    returnString += `${formatNumber(arr[0].amount, "crypto")} ${arr[0].symbol}`;
  }
  return returnString;
};

const formatAmountsInArrayForSuccessfulSwap = (
  receipt: any,
  arr: any,
  swapType: ESwapEventEmitVariable,
  swapObject: ISwapObject | undefined
) => {
  if (!swapObject) return [];
  arr = JSON.parse(JSON.stringify(arr)); //deep copy to ensure it doesnt replace the arr
  for (let i in arr) {
    arr[i].amount =
      parseInt(
        // receipt.events.SwapEthForTokensEvent.returnValues.swapTo[i][1],
        receipt.events[swapObject?.event].returnValues[swapType][i][1]
      ) / Math.pow(10, arr[i].decimals);
  }
  return arr;
};

const getLinkToBlockExplorer = (hash: string, chain: EBlockchainNetwork) => {
  if (chain === EBlockchainNetwork.ETH) {
    return (
      <a href={`https://etherscan.io/tx/${hash}`} target="_blank">
        <ScanOutlined />
      </a>
    );
  } else if (chain === EBlockchainNetwork.FTM) {
    return (
      <a href={`https://ftmscan.com/tx/${hash}`} target="_blank">
        <ScanOutlined />
      </a>
    );
  } else if (chain === EBlockchainNetwork.GOERLI) {
    return (
      <a href={`https://goerli.etherscan.io/tx/${hash}`} target="_blank">
        <ScanOutlined />
      </a>
    );
  }
};

interface IGetSuccessfulSwapText {
  receipt: any;
  swapType: ESwapType;
  swapToDetails: ISwapItemDetails[];
  swapObject: ISwapObject;
  swapFrom: ISwapDetails[];
  swapFromDetails: ISwapItemDetails[];
  chain: EBlockchainNetwork;
}

export const getSuccessfulSwapText = ({
  receipt,
  swapType,
  swapToDetails,
  swapObject,
  swapFrom,
  swapFromDetails,
  chain,
}: IGetSuccessfulSwapText) => {
  if (swapType === ESwapType.ETH_TO_MULTI_TOKEN_PERCENT) {
    let swapToDetailsTemp = formatAmountsInArrayForSuccessfulSwap(
      receipt,
      swapToDetails,
      ESwapEventEmitVariable.SWAP_TO,
      swapObject
    );
    return (
      <span>
        {`You have successfully swapped ${formatNumber(
          swapFrom[0].amount,
          "crypto"
        )} ${swapFrom[0].symbol} for ${getIndividualSwapText(
          swapToDetailsTemp
        )}`}
        {getLinkToBlockExplorer(receipt.transactionHash, chain)}
      </span>
    );
  } else if (swapType === ESwapType.MULTI_TOKEN_TO_ETH) {
    return (
      <span>
        {`You have successfully swapped ${getIndividualSwapText(
          swapFromDetails
        )} for ${formatNumber(
          receipt.events[swapObject?.event as any].returnValues.swapToAmount /
            Math.pow(10, swapToDetails[0].decimals),
          "crypto"
        )} ${swapToDetails[0].symbol}`}
        {getLinkToBlockExplorer(receipt.transactionHash, chain)}
      </span>
    );
  } else {
    let swapToDetailsTemp = formatAmountsInArrayForSuccessfulSwap(
      receipt,
      swapToDetails,
      ESwapEventEmitVariable.SWAP_TO,
      swapObject
    );
    return (
      <span>
        {`You have successfully swapped ${getIndividualSwapText(
          swapFromDetails
        )} for ${getIndividualSwapText(swapToDetailsTemp)}`}
        {getLinkToBlockExplorer(receipt.transactionHash, chain)}
      </span>
    );
  }
};

export const getPendingSwapText = (
  swapFromDetails: ISwapItemDetails[],
  swapToDetails: ISwapItemDetails[]
) => {
  return `Swapping ${getIndividualSwapText(
    swapFromDetails
  )} for ${getIndividualSwapText(swapToDetails)}`;
};
