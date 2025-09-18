import React from 'react';
import UIButton from '@src/components/button';
import { DownOutlined } from '@ant-design/icons';
import SelectAssetModal from '../../modal/select-asset';
import { ESWapDirection } from '@src/enum';
import SwapItemInput from './input';

interface SwapItemInputAndSelectProps {
  type: ESWapDirection;
  amount: number | undefined;
  percentInput: number | undefined;
  changeAmountInputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInputBlur: () => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  asset: string;
  index: number;
  assetHasBeenSelected: () => void;
  getBalanceFromChild: (bal: number) => void;
}

const SwapItemInputAndSelect: React.FC<SwapItemInputAndSelectProps> = ({
  type,
  amount,
  percentInput,
  changeAmountInputHandler,
  onInputFocus,
  onInputBlur,
  isModalOpen,
  setIsModalOpen,
  asset,
  index,
  assetHasBeenSelected,
  getBalanceFromChild,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center mb-2">
      <div className="sm:flex-1 w-full">
        {type === ESWapDirection.FROM ? (
          <SwapItemInput
            onChange={changeAmountInputHandler}
            value={amount}
            placeholder={'0.0'}
            type={'number'}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
          />
        ) : (
          <div className="flex items-center">
            <SwapItemInput
              onChange={changeAmountInputHandler}
              placeholder={'0'}
              value={percentInput}
              type={'number'}
              min={'0'}
              max={'100'}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
            />
            <div>
              <span>%</span>
            </div>
          </div>
        )}
      </div>
      <div className="sm:flex-shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
        <UIButton
          variant="filled"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {asset ? asset : <span>Select A Token</span>} <DownOutlined />
        </UIButton>
        {isModalOpen && (
          <SelectAssetModal
            isModalOpen={isModalOpen}
            index={index}
            type={type}
            amount={type === 'from' ? amount || 0 : percentInput || 0}
            passBalanceToParent={
              type === 'from' ? getBalanceFromChild : () => {}
            }
            assetHasBeenSelected={assetHasBeenSelected}
            asset={asset}
            closeModal={() => {
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SwapItemInputAndSelect;
