import { MinusCircleOutlined } from '@ant-design/icons';
import classes from '../index.module.css';

import { FC } from 'react';

export interface ISwapItemHeaderBase {
  header: string;
  count: number;
  minusHandler: () => void;
}

const SwapItemHeaderBase: FC<ISwapItemHeaderBase> = ({
  header,
  count,
  minusHandler,
}) => {
  return (
    <div className="flex justify-between">
      <div>{header}</div>
      <div>
        {count > 1 && (
          <MinusCircleOutlined
            className={classes.minus}
            onClick={minusHandler}
          />
        )}
      </div>
    </div>
  );
};

export default SwapItemHeaderBase;
