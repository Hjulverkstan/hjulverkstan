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
        <DialogTitle>Completing this repair will notify the customer</DialogTitle>
        <DialogDescription>
          The SMS will be sent to the customers phone: {phoneNumber}
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
            text="Complete & notify"
          />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
