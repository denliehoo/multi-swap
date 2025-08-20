'use client';
import { Popconfirm } from 'antd';
import { FC } from 'react';
import { TooltipPlacement } from 'antd/lib/tooltip';

interface IConnectWalletPopup {
  placement?: TooltipPlacement;
}

const ConnectWalletPopup: FC<IConnectWalletPopup> = ({ placement }) => {
  return (
    <Popconfirm
      placement={placement || 'bottom'}
      title={'Wallet not found. Try Metamask?'}
      showCancel={false}
      // description={"Try metamask?"}
      okText={
        <a href="https://metamask.io/" target="_blank" rel="noreferrer">
          Lets Go!
        </a>
      }
    >
      Connect Wallet
    </Popconfirm>
  );
};
export default ConnectWalletPopup;
