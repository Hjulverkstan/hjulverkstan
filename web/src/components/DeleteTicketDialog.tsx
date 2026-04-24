import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { Trash2, XCircle } from 'lucide-react';

interface DeleteTicketProps {
  onCancel?: () => void;
  onCloseTicket?: () => void;
  onDelete?: () => void;
  entity: string;
  entityId?: string;
}

export default function DeleteTicketDialog({
  onCancel,
  onCloseTicket,
  onDelete,
  entity,
  entityId,
}: DeleteTicketProps) {
  const item = entity.toLowerCase();
  const id = entityId?.toLowerCase();

  return (
    <DialogContent className="max-w-[600px] p-8 text-left">
      <DialogHeader>
        <DialogTitle className="mb-4 text-xl text-foreground">
          Confirm deletion
        </DialogTitle>
        <DialogDescription className="leading-relaxed text-slate-700">
          <p className="mb-4">
            {`You are trying to delete ticket ${item ? `with id ${id}` : 'this ticket'}.`}
          </p>
          <div className="space-y-4">
            <p>
              <strong>Close</strong> sets the status to closed – the recommended
              action.
            </p>
            <p>
              <strong>Delete</strong> is unfavourable as the intent is to
              preserve history for tickets.
              <strong>
                {' '}
                Only use when the ticket is incorrect and should not be
                preserved.
              </strong>
            </p>
          </div>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-6 flex flex-row items-center">
        <DialogClose asChild>
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            className="mr-auto"
          >
            Cancel
          </Button>
        </DialogClose>

        <div className="flex gap-3">
          <DialogClose asChild>
            <IconButton
              variant="secondaryBorder"
              icon={XCircle}
              text="Close"
              onClick={onCloseTicket}
            />
          </DialogClose>
          <DialogClose asChild>
            <IconButton
              variant="red"
              icon={Trash2}
              text="Delete"
              onClick={onDelete}
            />
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
