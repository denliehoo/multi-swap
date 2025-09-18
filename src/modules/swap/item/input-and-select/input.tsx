import { DetailedHTMLProps, FC, InputHTMLAttributes } from 'react';

interface ISwapItemInput
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

const SwapItemInput: FC<ISwapItemInput> = (props) => {
  return (
    <input
      className="text-2xl text-primary-default bg-transparent border-none outline-none"
      {...props}
    />
  );
};

export default SwapItemInput;
