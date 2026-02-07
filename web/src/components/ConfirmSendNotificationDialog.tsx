import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { SendIcon } from 'lucide-react';

interface confirmSendNotificationDialogProps {
  onSend: () => void;
  phoneNumber: string;
}

export default function ConfirmSendNotificationDialog({
  onSend,
  phoneNumber,
}: confirmSendNotificationDialogProps) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Changing status will notify the customer</DialogTitle>
        <DialogDescription>
          You will send SMS to number: {phoneNumber}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button">
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <IconButton
            variant="outline"
            type="submit"
            onClick={onSend}
            icon={SendIcon}
            text="Send"
          />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
