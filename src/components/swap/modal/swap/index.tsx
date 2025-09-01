import { Modal, notification } from 'antd';
import { useEffect, useState, useRef, FC, ReactNode } from 'react';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { NotificationPlacement } from 'antd/es/notification/interface';
import {
  ISwapDetails,
  useSwapDispatch,
  useSwapState,
} from '@src/reducers/swap';
import { MULTISWAP_ADDRESS, UINT_256_MAX_AMOUNT } from '@src/config';
import SwapModalLoadingContent from './modal-content/loading';
import SwapModalPreviewSwapContent from './modal-content/preview-swap';
import SwapModalPendingConfirmationContent from './modal-content/pending-confirmation';
import SwapModalSwapSubmittedContent from './modal-content/swap-submitted';
import { getAmountsOutDetails } from './utils/get-amounts-out-details';
import { initiateSwap } from './utils/initiate-swap';
import { useConnectWalletState } from '@src/reducers/connect-wallet';
import { useClearTokenBalancesCache } from '@src/hooks/query/use-token-balances';

export interface ISwapItemDetails
  extends Omit<ISwapDetails, 'index' | 'address' | 'balance'> {}

export enum ESwapType {
  ETH_TO_MULTI_TOKEN_PERCENT = 'swapEthForMultipleTokensByPercent',
  MULTI_TOKEN_TO_ETH = 'swapMultipleTokensForEth',
  MULTI_TOKEN_TO_MULTI_TOKEN_PERCENT = 'swapMultipleTokensForMultipleTokensByPercent',
  MULTI_TOKEN_TO_MULTI_TOKEN_AND_ETH_PERCENT = 'swapMultipleTokensForMultipleTokensAndEthByPercent',
  MULTI_TOKEN_AND_ETH_TO_MULTI_TOKEN_PERCENT = 'swapTokensAndEthForMultipleTokensByPercent',
}

export enum ESwapEventEmitVariable {
  SWAP_FROM = 'swapFrom',
  SWAP_TO = 'swapTo',
}

export const SWAP_TYPE_EVENT_MAP: Record<ESwapType, string> = {
  [ESwapType.ETH_TO_MULTI_TOKEN_PERCENT]: 'SwapEthForTokensEvent',
  [ESwapType.MULTI_TOKEN_TO_ETH]: 'SwapTokensForEthEvent',
  [ESwapType.MULTI_TOKEN_TO_MULTI_TOKEN_PERCENT]: 'SwapTokensForTokensEvent',
  [ESwapType.MULTI_TOKEN_TO_MULTI_TOKEN_AND_ETH_PERCENT]:
    'SwapTokensForTokensAndEthEvent',
  [ESwapType.MULTI_TOKEN_AND_ETH_TO_MULTI_TOKEN_PERCENT]:
    'SwapEthAndTokensForTokensEvent',
};

// TODO: Proper typing for swapObject once redux revamped
export interface ISwapObject {
  amount?: string[];
  poolAddresses?: string[];
  percentForEachToken?: string[];
  poolAddressesIn?: string[];
  amountForEachTokens?: string[];
  amountForEachTokensIn?: string[];
  poolAddressesOut?: string[];
  percentForEachTokenOut?: string[];
  event: string;
}

export interface ITokensRequiringApproval {
  address: string;
  symbol: string;
  buttonIsLoading: boolean;
  contract: any;
}

interface IPreviewSwapModal {
  visible: boolean;
  resetPercentageArray: () => void;
  showNotificationInSwapJs: (
    message: string,
    description: ReactNode,
    icon: ReactNode,
    placement: NotificationPlacement,
    duration?: number,
  ) => void;
  setSwapIsLoading: (isLoading: boolean) => void;
  closePreviewAssetModal: () => void;
}

const PreviewSwapModal: FC<IPreviewSwapModal> = (props) => {
  const { swapFrom, swapTo } = useSwapState();
  const { multiswap, address, web3, chain } = useConnectWalletState();
  const { remove: removeTokenBalances } = useClearTokenBalancesCache();

  const { resetSwapAction: resetSwap } = useSwapDispatch();

  const [modalContent, setModalContent] = useState('loading');
  const [swapFromDetails, setSwapFromDetails] = useState<ISwapItemDetails[]>(
    [],
  );
  const [swapToDetails, setSwapToDetails] = useState<ISwapItemDetails[]>([]);
  const [swapType, setSwapType] = useState<ESwapType | undefined>(undefined);
  const [swapObject, setSwapObject] = useState<ISwapObject | undefined>(
    undefined,
  );
  const [tokensRequiringApproval, setTokensRequiringApproval] = useState<
    ITokensRequiringApproval[]
  >([]);
  const [tokensApproved, setTokensApproved] = useState<string[]>([]);
  const [approvalRequiredBorder, setApprovalRequiredBorder] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const previewSwapModalContentRef = useRef<HTMLDivElement | null>(null);
  // in the future, refactor native_address uint2566, contract address
  // put it in a config folder and use it for the connectWallerReducer file too
  // const NATIVE_ADDRESS = '0x0000000000000000000000000000000000000000'
  // const WETH_ADDRESS = {
  //   goerli: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  //   ftm: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83',
  // }
  // const UINT_256_MAX_AMOUNT =
  //   '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
  // const MULTISWAP_ADDRESS = {
  //   goerli: '0x6aD14F3770bb85a35706DCa781E003Fcf1e716e3',
  // }
  const openNotification = (
    message: string,
    placement: NotificationPlacement,
  ) => {
    api.info({
      message: message,
      placement,
      icon: <ExclamationCircleOutlined />,
      // duration: 0
    });
  };

  const setSwapDetails = (
    swapFromDetails: ISwapItemDetails[],
    swapToDetails: ISwapItemDetails[],
    swapType: ESwapType,
    swapObject: ISwapObject,
    tokensRequiringApproval: ITokensRequiringApproval[],
  ) => {
    /* swapfrom and to details is only for display layout; hence it should be formatted to show the amount / 10^num
    of dps swapobject is that actual one sending to smart contract. Hence need take into account decimals */
    setSwapFromDetails(swapFromDetails);
    setSwapToDetails(swapToDetails);
    setSwapType(swapType);
    setSwapObject(swapObject);
    setModalContent('previewSwap');
    setTokensRequiringApproval(tokensRequiringApproval);
  };

  const initiateSwapHandler = async () => {
    await initiateSwap({
      swapType,
      setModalContent,
      swapObject,
      multiswap,
      address,
      web3,
      showNotificationInSwapJs: props.showNotificationInSwapJs,
      swapToDetails,
      swapFrom,
      swapFromDetails,
      chain,
      setSwapIsLoading: props.setSwapIsLoading,
      openNotification,
    });
    // Clear toke balance cache upon swap confirmed
    removeTokenBalances();
  };

  const closeModalHandler = () => {
    setModalContent('loading');
    setSwapFromDetails([]);
    setSwapToDetails([]);
    setSwapType(undefined);
    setSwapObject(undefined);
    setTokensRequiringApproval([]);
    setTokensApproved([]);
    setApprovalRequiredBorder(false);
    props.closePreviewAssetModal();
  };

  const approveAllTokensButtonHandler = () => {
    if (previewSwapModalContentRef.current) {
      previewSwapModalContentRef.current.scrollTop = 0;
    }
    setApprovalRequiredBorder(true);
    const timer = setTimeout(() => {
      setApprovalRequiredBorder(false);
    }, 600);
    return () => clearTimeout(timer);
  };

  const approveTokenHandler = async (
    token: ITokensRequiringApproval,
    index: number,
  ) => {
    try {
      setTokensRequiringApproval((prevState) => {
        const newState = [...prevState];
        newState[index].buttonIsLoading = true;
        return newState;
      });

      const approved = await token.contract.methods
        .approve(MULTISWAP_ADDRESS[chain], UINT_256_MAX_AMOUNT)
        .send({ from: address });
      if (approved.events.Approval.returnValues) {
        setTokensRequiringApproval((prevState) => {
          const newState = [...prevState];
          newState[index].buttonIsLoading = false;
          return newState;
        });
        setTokensApproved((prevState) => {
          const newState = [...prevState];
          newState.push(token.address);
          return newState;
        });
      } else {
        console.log('Approved but something went wrong...');
      }
    } catch {
      openNotification('You have rejected the token approval', 'top');
      setTokensRequiringApproval((prevState) => {
        const newState = [...prevState];
        newState[index].buttonIsLoading = false;
        return newState;
      });
    }
  };

  const resetSwapToDefaultHandler = () => {
    closeModalHandler();
    props.resetPercentageArray();
    resetSwap();
  };

  useEffect(() => {
    props.visible &&
      getAmountsOutDetails({
        swapFrom,
        swapTo,
        multiswap,
        setSwapDetails,
        chain,
        address,
        web3,
        closeModalHandler,
        showNotificationInSwapJs: props.showNotificationInSwapJs,
      });
    // Call only once when modal is visible
    // TODO: Find a better solution to this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.visible]);

  return (
    <Modal
      title={modalContent === 'previewSwap' ? 'Preview Swap' : ''}
      open={props.visible}
      onCancel={
        modalContent === 'swapSubmitted'
          ? resetSwapToDefaultHandler
          : closeModalHandler
      }
      footer={null}
      styles={{ body: { height: '60vh' } }}
      maskClosable={false}
    >
      {contextHolder}
      {/* loading > preview swap > pending confirmation > swap submitted */}
      {/* Loading Spinner */}
      {modalContent === 'loading' && <SwapModalLoadingContent />}

      {/* Preview Swap */}
      {modalContent === 'previewSwap' && (
        <SwapModalPreviewSwapContent
          previewSwapModalContentRef={previewSwapModalContentRef}
          tokensRequiringApproval={tokensRequiringApproval}
          approvalRequiredBorder={approvalRequiredBorder}
          tokensApproved={tokensApproved}
          swapFromDetails={swapFromDetails}
          approveTokenHandler={approveTokenHandler}
          swapToDetails={swapToDetails}
          approveAllTokensButtonHandler={approveAllTokensButtonHandler}
          initiateSwap={initiateSwapHandler}
        />
      )}

      {/* Peding Confirmation */}
      {modalContent === 'pendingConfirmation' && (
        <SwapModalPendingConfirmationContent
          swapFromDetails={swapFromDetails}
          swapToDetails={swapToDetails}
        />
      )}

      {/* Swap Submitted */}
      {modalContent === 'swapSubmitted' && (
        <SwapModalSwapSubmittedContent
          resetSwapToDefaultHandler={resetSwapToDefaultHandler}
        />
      )}
    </Modal>
  );
};

export default PreviewSwapModal;
