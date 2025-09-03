import { ESwapType, ISwapItemDetails, ISwapObject } from '..';
import { getPendingSwapText, getSuccessfulSwapText } from './text';
import { ReactNode } from 'react';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { ISwapDetails } from '@src/reducers/swap';
import { EBlockchainNetwork } from '@src/enum';
import { NotificationPlacement } from 'antd/es/notification/interface';

interface IInitiateSwap {
  swapType?: ESwapType;
  setModalContent: (modalType: string) => void;
  swapObject?: ISwapObject;
  multiswap: any;
  address: string;
  web3: any;
  showNotificationInSwapJs: (
    message: string,
    description: ReactNode,
    icon: ReactNode,
    placement: NotificationPlacement,
    duration?: number,
  ) => void;
  swapToDetails: ISwapItemDetails[];
  swapFrom: ISwapDetails[];
  swapFromDetails: ISwapItemDetails[];
  chain: EBlockchainNetwork;
  setSwapIsLoading: (isLoading: boolean) => void;
  openNotification: (message: string, placement: NotificationPlacement) => void;
}

export const initiateSwap = async ({
  swapType,
  setModalContent,
  swapObject,
  multiswap,
  address,
  web3,
  showNotificationInSwapJs,
  swapToDetails,
  swapFrom,
  swapFromDetails,
  chain,
  setSwapIsLoading,
  openNotification,
}: IInitiateSwap) => {
  if (!swapType || !swapObject) {
    return;
  }
  // console.log(swapFromDetails)
  // console.log(swapToDetails)
  setModalContent('pendingConfirmation');
  let callSwap;
  try {
    if (swapType === ESwapType.ETH_TO_MULTI_TOKEN_PERCENT) {
      // 1. ETH -> ERC20(s)
      callSwap = await multiswap.methods
        .swapEthForMultipleTokensByPercent(
          swapObject.poolAddresses,
          swapObject.percentForEachToken,
        )
        .send({
          from: address,
          value: swapObject.amount && swapObject.amount[0],
        }) // only when user clicks confirm on metamask will this next step appear
        .on('transactionHash', (_hash: string) => {
          // console.log(`Transaction hash: ${hash}. user has confirmed`)
          userAcceptedTransaction(
            showNotificationInSwapJs,
            swapFromDetails,
            swapToDetails,
            setSwapIsLoading,
            setModalContent,
          );
        });
    } else if (swapType === ESwapType.MULTI_TOKEN_TO_ETH) {
      // 2. ERC20(s) -> ETH
      callSwap = await multiswap.methods
        .swapMultipleTokensForEth(
          swapObject.poolAddresses,
          swapObject.amountForEachTokens,
        )
        .send({
          from: address,
        })
        .on('transactionHash', (_hash: string) => {
          userAcceptedTransaction(
            showNotificationInSwapJs,
            swapFromDetails,
            swapToDetails,
            setSwapIsLoading,
            setModalContent,
          );
        });
    } else if (swapType === ESwapType.MULTI_TOKEN_TO_MULTI_TOKEN_PERCENT) {
      // 3. ERC20(s) -> ERC20(s)
      callSwap = await multiswap.methods
        .swapMultipleTokensForMultipleTokensByPercent(
          swapObject.poolAddressesIn,
          swapObject.amountForEachTokensIn,
          swapObject.poolAddressesOut,
          swapObject.percentForEachTokenOut,
        )
        .send({
          from: address,
        })
        .on('transactionHash', (_hash: string) => {
          userAcceptedTransaction(
            showNotificationInSwapJs,
            swapFromDetails,
            swapToDetails,
            setSwapIsLoading,
            setModalContent,
          );
        });
    } else if (
      swapType === ESwapType.MULTI_TOKEN_TO_MULTI_TOKEN_AND_ETH_PERCENT
    ) {
      // 4. ERC20(s) -> ETH + ERC20(s)
      callSwap = await multiswap.methods
        .swapMultipleTokensForMultipleTokensAndEthByPercent(
          swapObject.poolAddressesIn,
          swapObject.amountForEachTokensIn,
          swapObject.poolAddressesOut,
          swapObject.percentForEachTokenOut,
        )
        .send({
          from: address,
        })
        .on('transactionHash', (_hash: string) => {
          userAcceptedTransaction(
            showNotificationInSwapJs,
            swapFromDetails,
            swapToDetails,
            setSwapIsLoading,
            setModalContent,
          );
        });
    } else if (
      swapType === ESwapType.MULTI_TOKEN_AND_ETH_TO_MULTI_TOKEN_PERCENT
    ) {
      // 5. ETH + ERC20 -> ERC20(s)
      const value = swapObject.amountForEachTokensIn
        ? swapObject.amountForEachTokensIn[
            swapObject.amountForEachTokensIn.length - 1
          ]
        : 0;

      callSwap = await multiswap.methods
        .swapTokensAndEthForMultipleTokensByPercent(
          swapObject.poolAddressesIn,
          swapObject.amountForEachTokensIn,
          swapObject.poolAddressesOut,
          swapObject.percentForEachTokenOut,
        )
        .send({
          from: address,
          value,
        })
        .on('transactionHash', (_hash: string) => {
          userAcceptedTransaction(
            showNotificationInSwapJs,
            swapFromDetails,
            swapToDetails,
            setSwapIsLoading,
            setModalContent,
          );
        });
    }

    // Promise will resolve once the transaction has been confirmed and mined
    const receipt = await web3.eth.getTransactionReceipt(
      callSwap.transactionHash,
    );
    console.log(receipt);
    console.log(callSwap);
    showNotificationInSwapJs(
      'Transaction Completed',
      getSuccessfulSwapText({
        receipt: callSwap,
        swapType,
        swapToDetails,
        swapObject,
        swapFrom,
        swapFromDetails,
        chain,
      }),
      <CheckCircleOutlined />,
      'topRight',
      60,
    );

    setSwapIsLoading(false);
    // in the future, show also push to history
    //
  } catch (e: any) {
    if (e?.code === 4001) {
      setModalContent('previewSwap');
      openNotification('You have rejected the transaction', 'top');
    } else {
      console.log(e);
    }
  }
};

const userAcceptedTransaction = (
  showNotificationInSwapJs: (
    message: string,
    description: ReactNode,
    icon: ReactNode,
    placement: NotificationPlacement,
    duration?: number,
  ) => void,
  swapFromDetails: ISwapItemDetails[],
  swapToDetails: ISwapItemDetails[],
  setSwapIsLoading: (isLoading: boolean) => void,
  setModalContent: (modalType: string) => void,
) => {
  showNotificationInSwapJs(
    'Transaction Pending',
    getPendingSwapText(swapFromDetails, swapToDetails),
    <LoadingOutlined />,
    'topRight',
    15,
  );
  setSwapIsLoading(true);
  setModalContent('swapSubmitted');
};
