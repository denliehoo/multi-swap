import {
  Description,
  Dialog,
  DialogBackdrop,
  DialogPanel,
} from '@headlessui/react';
import { FC, ReactNode, useEffect } from 'react';

interface IUIModal {
  title: ReactNode | string;
  children: ReactNode;
  onClose: () => void;
  isOpen: boolean;
  closeOnOverlayClick?: boolean;
}

const UIModal: FC<IUIModal> = (props) => {
  const { title, children, onClose, isOpen, closeOnOverlayClick } = props;

  const onClickOverlayHandler = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }
  return (
    <Dialog
      onClose={onClickOverlayHandler}
      open={isOpen}
      className="relative z-50"
      static={true}
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center">
        <DialogBackdrop className="fixed inset-0 bg-bg-default/80" />

        <DialogPanel className="min-w-[320px] sm:min-w-[500px] space-y-4 border-[3px] border-[var(--color-primary-default)] bg-bg-default p-4 shadow-[0_0_16px_4px_var(--color-primary-active)] rounded-2xl z-50">
          <div className="flex items-center justify-between">
            <div className="font-bold text-text-primary">{title}</div>
            <div
              className="cursor-pointer text-text-primary pr-2"
              onClick={onClose}
            >
              X
            </div>
          </div>
          <Description className="text-text-primary">{children}</Description>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
export default UIModal;
