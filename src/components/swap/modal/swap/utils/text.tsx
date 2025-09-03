import { formatNumber } from '@src/utils/format/number';
import {
  ESwapEventEmitVariable,
  ESwapType,
  ISwapItemDetails,
  ISwapObject,
} from '..';

import { ScanOutlined } from '@ant-design/icons';
import { ISwapDetails } from '@src/reducers/swap';
import { EBlockchainNetwork } from '@src/enum';

export const getIndividualSwapText = (arr: ISwapItemDetails[]) => {
  let returnString = '';
  if (arr.length > 1) {
    for (const i in arr) {
      if (arr.length - 1 === Number.parseFloat(i)) {
        returnString = returnString.substring(0, returnString.length - 2);
        returnString += ` and ${formatNumber(arr[i].amount, 'crypto')} ${
          arr[i].symbol
        }`;
      } else {
        returnString += `${formatNumber(arr[i].amount, 'crypto')} ${
          arr[i].symbol
        }, `;
      }
    }
  } else {
    returnString += `${formatNumber(arr[0].amount, 'crypto')} ${arr[0].symbol}`;
  }
  return returnString;
};

const formatAmountsInArrayForSuccessfulSwap = (
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  receipt: any,
  arrToFormat: unknown[],
  swapType: ESwapEventEmitVariable,
  swapObject: ISwapObject | undefined,
) => {
  if (!swapObject) return [];
  const arr = JSON.parse(JSON.stringify(arrToFormat)); //deep copy to ensure it doesnt replace the arr
  for (const i in arr) {
    arr[i].amount =
      Number.parseInt(
        // receipt.events.SwapEthForTokensEvent.returnValues.swapTo[i][1],
        receipt.events[swapObject?.event].returnValues[swapType][i][1],
      ) /
      10 ** arr[i].decimals;
  }
  return arr;
};

const getLinkToBlockExplorer = (hash: string, chain: EBlockchainNetwork) => {
  if (chain === EBlockchainNetwork.ETH) {
    return (
      <a
        href={`https://etherscan.io/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        <ScanOutlined />
      </a>
    );
  }
  if (chain === EBlockchainNetwork.FTM) {
    return (
      <a
        href={`https://ftmscan.com/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        <ScanOutlined />
      </a>
    );
  }
  if (chain === EBlockchainNetwork.SEPOLIA) {
    return (
      <a
        href={`https://sepolia.etherscan.io/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        <ScanOutlined />
      </a>
    );
  }
};

interface IGetSuccessfulSwapText {
  // biome-ignore lint/suspicious/noExplicitAny: <TODO: Implement>
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
    const swapToDetailsTemp = formatAmountsInArrayForSuccessfulSwap(
      receipt,
      swapToDetails,
      ESwapEventEmitVariable.SWAP_TO,
      swapObject,
    );
    return (
      <span>
        {`You have successfully swapped ${formatNumber(
          swapFrom[0].amount,
          'crypto',
        )} ${swapFrom[0].symbol} for ${getIndividualSwapText(
          swapToDetailsTemp,
        )}`}
        {getLinkToBlockExplorer(receipt.transactionHash, chain)}
      </span>
    );
  }
  if (swapType === ESwapType.MULTI_TOKEN_TO_ETH) {
    return (
      <span>
        {`You have successfully swapped ${getIndividualSwapText(
          swapFromDetails,
        )} for ${formatNumber(
          receipt.events[swapObject?.event].returnValues.swapToAmount /
            10 ** swapToDetails[0].decimals,
          'crypto',
        )} ${swapToDetails[0].symbol}`}
        {getLinkToBlockExplorer(receipt.transactionHash, chain)}
      </span>
    );
  }
  const swapToDetailsTemp = formatAmountsInArrayForSuccessfulSwap(
    receipt,
    swapToDetails,
    ESwapEventEmitVariable.SWAP_TO,
    swapObject,
  );
  return (
    <span>
      {`You have successfully swapped ${getIndividualSwapText(
        swapFromDetails,
      )} for ${getIndividualSwapText(swapToDetailsTemp)}`}
      {getLinkToBlockExplorer(receipt.transactionHash, chain)}
    </span>
  );
};

export const getPendingSwapText = (
  swapFromDetails: ISwapItemDetails[],
  swapToDetails: ISwapItemDetails[],
) => {
  return `Swapping ${getIndividualSwapText(
    swapFromDetails,
  )} for ${getIndividualSwapText(swapToDetails)}`;
};
