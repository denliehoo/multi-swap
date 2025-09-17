import { Button } from '@headlessui/react';
import { cx } from '@src/utils/theme/cx';
import { ClassValue } from 'clsx';
import { ButtonHTMLAttributes, FC } from 'react';
import ButtonSpinner from './spinner';

type TUIButtonVariant = 'filled' | 'outline';

interface IUIButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: TUIButtonVariant;
  block?: boolean;
  loading?: boolean;
}

const VARIANT_STYLES: Record<TUIButtonVariant, ClassValue> = {
  filled:
    'bg-primary-default text-text-primary data-hover:bg-primary-hover data-active:bg-primary-active',
  outline:
    'border border-text-primary text-text-primary data-hover:border-primary-hover data-hover:text-primary-hover data-active:border-primary-active data-active:text-primary-active',
};

const UIButton: FC<IUIButton> = (props) => {
  const {
    className,
    block,
    variant = 'outline',
    loading,
    children,
    disabled,
    ...restProps
  } = props;

  const isDisabled = disabled || loading;

  return (
    <Button
      disabled={isDisabled}
      {...restProps}
      className={cx(
        block && 'w-full',
        'px-4 py-2 rounded-xl cursor-pointer flex items-center gap-2 justify-center',
        VARIANT_STYLES[variant],
        isDisabled && 'opacity-60 cursor-not-allowed',
        className,
      )}
    >
      {loading && <ButtonSpinner />}
      {children}
    </Button>
  );
};
export default UIButton;
