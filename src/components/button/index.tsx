import { Button } from '@headlessui/react';
import clsx, { ClassValue } from 'clsx';
import { ButtonHTMLAttributes, FC } from 'react';

type TUIButtonVariant = 'filled' | 'outline';

interface IUIButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TUIButtonVariant;
  block?: boolean;
}

const VARIANT_STYLES: Record<TUIButtonVariant, ClassValue> = {
  filled:
    'bg-primary-default text-text-primary data-hover:bg-primary-hover data-active:bg-primary-active',
  outline:
    'border border-text-primary text-text-primary data-hover:border-primary-hover data-hover:text-primary-hover data-active:border-primary-active data-active:text-primary-active',
};

const UIButton: FC<IUIButton> = (props) => {
  const { className, block, variant = 'outline', ...restProps } = props;
  return (
    <Button
      {...restProps}
      className={clsx(
        block && 'w-full',
        'px-4 py-2 rounded-xl cursor-pointer',
        VARIANT_STYLES[variant],
        className,
      )}
    />
  );
};
export default UIButton;
