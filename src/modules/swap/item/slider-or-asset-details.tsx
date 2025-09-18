import { ESWapDirection } from '@src/enum';
import { formatNumber } from '@src/utils/format/number';
import { FC } from 'react';
import classes from './index.module.css';

interface ISwapSliderOrAssetDetails {
  type: ESWapDirection;
  price: number;
  priceIsLoading: boolean;
  amount: number | undefined;
  asset: string | undefined;
  balance: number;
  percentInput: number | undefined;
  changeAmountInputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
  onInputBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const SwapSliderOrAssetDetails: FC<ISwapSliderOrAssetDetails> = ({
  type,
  price,
  priceIsLoading,
  amount,
  asset,
  balance,
  percentInput,
  changeAmountInputHandler,
  onInputFocus,
  onInputBlur,
}) => {
  if (type === ESWapDirection.FROM) {
    return (
      <div className="flex justify-between">
        <div>
          {priceIsLoading ? '...' : formatNumber(price * (amount || 0), 'fiat')}
        </div>
        <div>Balance: {asset && formatNumber(balance, 'crypto')}</div>
      </div>
    );
  }
  return (
    <input
      type="range"
      id="points"
      name="points"
      min="0"
      max="100"
      step="5"
      value={percentInput}
      onChange={changeAmountInputHandler}
      className={classes.inputSlider}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
    />
  );
};
export default SwapSliderOrAssetDetails;
