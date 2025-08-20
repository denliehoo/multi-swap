import { ExclamationCircleOutlined } from '@ant-design/icons';
import { NATIVE_ADDRESS, WETH_ADDRESS } from '@src/config';
import { ISwapDetails } from '@src/reducers/swap';
import {
  ESwapType,
  ISwapItemDetails,
  ISwapObject,
  ITokensRequiringApproval,
  SWAP_TYPE_EVENT_MAP,
} from '..';
import { EBlockchainNetwork } from '@src/enum';
import { ReactNode } from 'react';
import { NotificationPlacement } from 'antd/es/notification/interface';
import { getContractABI } from '@src/api';

interface IGetAmountsOutDetails {
  swapFrom: ISwapDetails[];
  swapTo: ISwapDetails[];
  multiswap: any;
  setSwapDetails: (
    swapFromDetails: ISwapItemDetails[],
    swapToDetails: ISwapItemDetails[],
    swapType: ESwapType,
    swapObject: ISwapObject,
    tokensRequiringApproval: ITokensRequiringApproval[],
  ) => void;
  chain: EBlockchainNetwork;
  address: string;
  web3: any;
  closeModalHandler: () => void;
  showNotificationInSwapJs: (
    message: string,
    description: ReactNode,
    icon: ReactNode,
    placement: NotificationPlacement,
    duration?: number,
  ) => void;
}

export const getAmountsOutDetails = async ({
  swapFrom,
  swapTo,
  multiswap,
  setSwapDetails,
  chain,
  address,
  web3,
  closeModalHandler,
  showNotificationInSwapJs,
}: IGetAmountsOutDetails) => {
  let swapFromDetailsTemp = swapFrom.map((i) => ({
    amount: i.amount,
    symbol: i.symbol,
    price: i.price,
    decimals: i.decimals,
    imgUrl: i.imgUrl,
  }));
  let swapToDetailsTemp = swapTo.map((i) => ({
    amount: i.amount,
    symbol: i.symbol,
    price: i.price,
    decimals: i.decimals,
    imgUrl: i.imgUrl,
  }));

  const poolAddressesIn = swapFrom.map((i) => i.address);
  const poolAddressesOut = swapTo.map((i) => i.address);
  // note: we change to string because thats usually how we call functions in the contract; check migrations file.
  const amountForEachTokensIn = swapFrom.map((i) =>
    (i.amount * Math.pow(10, i.decimals)).toString(),
  );
  const percentForEachTokenOut = swapTo.map((i) => (i.amount * 100).toString()); // *100 because in basis point i.e. 50% = 5000

  // next time also need to consider which chain
  // 1. ETH -> ERC20s
  try {
    if (
      swapFrom.length === 1 &&
      swapFrom[0].address === NATIVE_ADDRESS &&
      !poolAddressesOut.includes(NATIVE_ADDRESS)
    ) {
      console.log('case 1');
      const ethAmount = amountForEachTokensIn[0];

      // note: best to use USDC and DAI for testing
      let amountsOut = await multiswap.methods
        .getAmountsOutEthForMultipleTokensByPercent(
          ethAmount,
          poolAddressesOut,
          percentForEachTokenOut,
        )
        .call();
      for (let i in swapToDetailsTemp) {
        swapToDetailsTemp[i].amount =
          amountsOut[i] / Math.pow(10, swapToDetailsTemp[i].decimals);
      }
      setSwapDetails(
        swapFromDetailsTemp,
        swapToDetailsTemp,
        ESwapType.ETH_TO_MULTI_TOKEN_PERCENT,
        {
          amount: [ethAmount],
          poolAddresses: poolAddressesOut,
          percentForEachToken: percentForEachTokenOut,
          event: SWAP_TYPE_EVENT_MAP[ESwapType.ETH_TO_MULTI_TOKEN_PERCENT],
        },
        [],
      );
    }
    // 2. ERC20(s) -> ETH
    else if (
      !poolAddressesIn.includes(NATIVE_ADDRESS) &&
      swapTo.length === 1 &&
      swapTo[0].address === NATIVE_ADDRESS
    ) {
      console.log('case 2!');
      let amountsOut = await multiswap.methods
        .getAmountsOutMultipleTokensForEth(
          poolAddressesIn,
          amountForEachTokensIn,
        )
        .call();

      swapToDetailsTemp[0].amount =
        amountsOut / Math.pow(10, swapToDetailsTemp[0].decimals);

      const tokensToApprove = await getTokensToApprove(
        poolAddressesIn,
        amountForEachTokensIn,
        swapFromDetailsTemp,
        multiswap,
        address,
        chain,
        web3,
      );

      setSwapDetails(
        swapFromDetailsTemp,
        swapToDetailsTemp,
        ESwapType.MULTI_TOKEN_TO_ETH,
        {
          poolAddresses: poolAddressesIn,
          amountForEachTokens: amountForEachTokensIn,
          event: SWAP_TYPE_EVENT_MAP[ESwapType.MULTI_TOKEN_TO_ETH],
        },
        tokensToApprove,
      );
    }
    // 3. ERC20(s) -> ERC20(s)
    else if (
      !poolAddressesIn.includes(NATIVE_ADDRESS) &&
      !poolAddressesOut.includes(NATIVE_ADDRESS)
    ) {
      console.log('case 3!');
      let amountsOut = await multiswap.methods
        .getAmountsOutMultipleTokensForMultipleTokensByPercent(
          poolAddressesIn,
          amountForEachTokensIn,
          poolAddressesOut,
          percentForEachTokenOut,
        )
        .call();

      for (let i in swapToDetailsTemp) {
        swapToDetailsTemp[i].amount =
          amountsOut[i] / Math.pow(10, swapToDetailsTemp[i].decimals);
      }

      const tokensToApprove = await getTokensToApprove(
        poolAddressesIn,
        amountForEachTokensIn,
        swapFromDetailsTemp,
        multiswap,
        address,
        chain,
        web3,
      );

      setSwapDetails(
        swapFromDetailsTemp,
        swapToDetailsTemp,
        ESwapType.MULTI_TOKEN_TO_MULTI_TOKEN_PERCENT,
        {
          poolAddressesIn: poolAddressesIn,
          amountForEachTokensIn: amountForEachTokensIn,
          poolAddressesOut: poolAddressesOut,
          percentForEachTokenOut: percentForEachTokenOut,
          event:
            SWAP_TYPE_EVENT_MAP[ESwapType.MULTI_TOKEN_TO_MULTI_TOKEN_PERCENT],
        },
        tokensToApprove,
      );
    }
    // 4. ERC20(s) -> ETH + ERC20(s)
    else if (
      !poolAddressesIn.includes(NATIVE_ADDRESS) &&
      poolAddressesOut.includes(NATIVE_ADDRESS) &&
      !(
        poolAddressesIn.includes(WETH_ADDRESS[chain]) &&
        poolAddressesOut.includes(NATIVE_ADDRESS)
      )
    ) {
      console.log('case 4!');

      const {
        addresses: orderedPoolAddressesOut,
        amounts: orderedPercentForEachTokenOut,
        indexToMove,
      } = reorderNativeToLast(poolAddressesOut, percentForEachTokenOut);

      let amountsOut = await multiswap.methods
        .getAmountsOutMultipleTokensForMultipleTokensAndEthByPercent(
          poolAddressesIn,
          amountForEachTokensIn,
          orderedPoolAddressesOut,
          orderedPercentForEachTokenOut,
        )
        .call();

      let orderedSwapToDetailsTemp = swapToDetailsTemp.map((i) => i);
      orderedSwapToDetailsTemp.push(
        ...orderedSwapToDetailsTemp.splice(indexToMove, 1),
      );

      for (let i in orderedSwapToDetailsTemp) {
        orderedSwapToDetailsTemp[i].amount =
          amountsOut[i] / Math.pow(10, orderedSwapToDetailsTemp[i].decimals);
      }

      const tokensToApprove = await getTokensToApprove(
        poolAddressesIn,
        amountForEachTokensIn,
        swapFromDetailsTemp,
        multiswap,
        address,
        chain,
        web3,
      );

      setSwapDetails(
        swapFromDetailsTemp,
        orderedSwapToDetailsTemp,
        ESwapType.MULTI_TOKEN_TO_MULTI_TOKEN_AND_ETH_PERCENT,
        {
          poolAddressesIn: poolAddressesIn,
          amountForEachTokensIn: amountForEachTokensIn,
          poolAddressesOut: orderedPoolAddressesOut,
          percentForEachTokenOut: orderedPercentForEachTokenOut,
          event:
            SWAP_TYPE_EVENT_MAP[
              ESwapType.MULTI_TOKEN_TO_MULTI_TOKEN_AND_ETH_PERCENT
            ],
        },
        tokensToApprove,
      );
    }
    // 5. ETH + ERC20 -> ERC20(s)
    else if (
      poolAddressesIn.includes(NATIVE_ADDRESS) &&
      !poolAddressesOut.includes(NATIVE_ADDRESS) &&
      !(
        poolAddressesIn.includes(NATIVE_ADDRESS) &&
        poolAddressesOut.includes(WETH_ADDRESS[chain as EBlockchainNetwork])
      )
    ) {
      console.log('case 5!');

      const {
        addresses: orderedPoolAddressesIn,
        amounts: orderedAmountForEachTokensIn,
        indexToMove,
      } = reorderNativeToLast(poolAddressesIn, amountForEachTokensIn);

      let amountsOut = await multiswap.methods
        .getAmountsOutTokensAndEthForMultipleTokensByPercent(
          orderedPoolAddressesIn,
          orderedAmountForEachTokensIn,
          poolAddressesOut,
          percentForEachTokenOut,
        )
        .call();

      for (let i in swapToDetailsTemp) {
        swapToDetailsTemp[i].amount =
          amountsOut[i] / Math.pow(10, swapToDetailsTemp[i].decimals);
      }

      let orderedSwapFromDetailsTemp = swapFromDetailsTemp.map((i) => i);
      orderedSwapFromDetailsTemp.push(
        ...orderedSwapFromDetailsTemp.splice(indexToMove, 1),
      );

      const tokensToApprove = await getTokensToApprove(
        poolAddressesIn.slice(0, -1),
        amountForEachTokensIn.slice(0, -1),
        orderedSwapFromDetailsTemp.slice(0, -1),
        multiswap,
        address,
        chain,
        web3,
      );

      setSwapDetails(
        orderedSwapFromDetailsTemp,
        swapToDetailsTemp,
        ESwapType.MULTI_TOKEN_AND_ETH_TO_MULTI_TOKEN_PERCENT,
        {
          poolAddressesIn: orderedPoolAddressesIn,
          amountForEachTokensIn: orderedAmountForEachTokensIn,
          poolAddressesOut: poolAddressesOut,
          percentForEachTokenOut: percentForEachTokenOut,
          event:
            SWAP_TYPE_EVENT_MAP[
              ESwapType.MULTI_TOKEN_AND_ETH_TO_MULTI_TOKEN_PERCENT
            ],
        },
        tokensToApprove,
      );
    }
    // if user tries swapping ETH with ETH or ETH -> WETH or WETH -> ETH
    else if (
      (poolAddressesIn.includes(NATIVE_ADDRESS) &&
        poolAddressesOut.includes(NATIVE_ADDRESS)) ||
      (poolAddressesIn.includes(WETH_ADDRESS[chain as EBlockchainNetwork]) &&
        poolAddressesOut.includes(NATIVE_ADDRESS)) ||
      (poolAddressesIn.includes(NATIVE_ADDRESS) &&
        poolAddressesOut.includes(WETH_ADDRESS[chain as EBlockchainNetwork]))
    ) {
      showNotificationInSwapJs(
        'Unable To Swap ETH for ETH or WETH, vice versa',
        'Try removing ETH or WETH in swap from or swap to',
        <ExclamationCircleOutlined />,
        'top',
      );
      closeModalHandler();
    }
    // eventually do the case for if swap two same tokens e.g. swapping usdt and usdt to ETH should reject
    // else if()
    else {
      console.log('something went wrong...');
      genericPreviewSwapErrorAction(
        showNotificationInSwapJs,
        closeModalHandler,
      );
    }
  } catch (e) {
    console.log(e);
    genericPreviewSwapErrorAction(showNotificationInSwapJs, closeModalHandler);
  }
};

const genericPreviewSwapErrorAction = (
  showNotificationInSwapJs: any,
  closeModalHandler: () => void,
) => {
  showNotificationInSwapJs(
    'Unable To Get Swap Details',
    'There seems to be an error in one of the tokens you are swapping to or from. Please swap to/from a different token',
    <ExclamationCircleOutlined />,
    'top',
  );
  closeModalHandler();
};

const getTokensToApprove = async (
  poolAddressesIn: string[],
  amountForEachTokensIn: string[],
  swapFromDetailsTemp: ISwapItemDetails[],
  multiswap: any,
  address: string,
  chain: EBlockchainNetwork,
  web3: any,
) => {
  let tokensToApprove: ITokensRequiringApproval[] = [];
  for (let i in poolAddressesIn) {
    const allowance = await multiswap.methods
      .allowanceERC20(poolAddressesIn[i])
      .call({ from: address });

    if (parseFloat(amountForEachTokensIn[i]) > parseFloat(allowance)) {
      const tokenContractABI = await getContractABI(chain, poolAddressesIn[i]);
      if (!tokenContractABI) {
        // TODO: Throw error
        return [];
      }
      const tokenContract = new web3.eth.Contract(
        tokenContractABI,
        poolAddressesIn[i],
      );
      console.log(tokenContract);

      tokensToApprove.push({
        address: poolAddressesIn[i],
        symbol: swapFromDetailsTemp[i].symbol,
        contract: tokenContract,
        buttonIsLoading: false,
      });
    }
  }
  return tokensToApprove;
};

const reorderNativeToLast = (addresses: string[], amounts: string[]) => {
  const indexToMove = addresses.indexOf(NATIVE_ADDRESS);
  const addressToMove = addresses.splice(indexToMove, 1);
  addresses.push(addressToMove[0]);
  const amountToMove = amounts.splice(indexToMove, 1);
  amounts.push(amountToMove[0]);
  return { addresses, amounts, indexToMove };
};
