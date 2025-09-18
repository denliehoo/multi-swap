import { FC } from 'react';
import SwapItemHeaderBase, { ISwapItemHeaderBase } from './base';
import { ESWapDirection } from '@src/enum';

interface ISwapItemHeader
  extends Omit<ISwapItemHeaderBase, 'header' | 'count'> {
  type: ESWapDirection;
  swapFromLength: number;
  swapToLength: number;
}

const SwapItemHeader: FC<ISwapItemHeader> = (props) => {
  const { type, swapFromLength, swapToLength, ...rest } = props;
  if (type === ESWapDirection.FROM) {
    return (
      <SwapItemHeaderBase
        {...rest}
        header="Amount To Swap"
        count={swapFromLength}
      />
    );
  }
  return (
    <SwapItemHeaderBase
      {...rest}
      header="Percentage To Receive"
      count={swapToLength}
    />
  );
};

export default SwapItemHeader;
