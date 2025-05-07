import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { RepeatIcon } from 'lucide-react';
import React from 'react';

interface confirmConvertDialogProps {
  conversionTitle: string;
  conversionDescription: string;
  message?: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function ConfirmConvertDialog({
  conversionTitle,
  conversionDescription,
  message,
  onConfirm,
  onClose,
  children,
}: confirmConvertDialogProps) {
  //

  return (
    <DialogContent className="flex flex-col sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{`${conversionTitle}`}</DialogTitle>
        <DialogDescription>{`${conversionDescription}`}</DialogDescription>

        <div className="my-4 w-full space-y-2">
          <DialogDescription>{message}</DialogDescription>
          <div className="w-full">
            <div className="[&>div]:flex [&>div]:flex-wrap [&>div]:gap-2">
              {children}
            </div>
          </div>
        </div>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <IconButton
            variant={'destructive'}
            type="submit"
            onClick={onConfirm}
            icon={RepeatIcon}
            text="Convert"
          />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
