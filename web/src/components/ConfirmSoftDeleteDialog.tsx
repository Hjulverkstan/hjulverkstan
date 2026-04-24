import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { Trash2 } from 'lucide-react';

interface confirmDeleteDialogProps {
  onCancel?: () => void;
  onDelete?: () => void;
  entity: string;
  entityId?: string;
}

export default function ConfirmDeleteDialog({
  onCancel,
  entity,
  entityId,
  onDelete,
}: confirmDeleteDialogProps) {
  const item = entity.toLowerCase();
  const id = entityId?.toLowerCase();

  return (
    <DialogContent className="max-w-[600px] p-8 text-left">
      <DialogHeader>
        <DialogTitle className="mb-4 text-xl">{'Confirm deletion'}</DialogTitle>
        <DialogDescription className="leading-relaxed text-slate-700">
          <p className="">
            {`You are trying to delete ${item} ${id ? `with id ${id}.` : ''}`}
          </p>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex flex-row items-center">
        <DialogClose asChild>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <IconButton
            variant={'red'}
            type="button"
            onClick={onDelete}
            icon={Trash2}
            text="Delete"
            className="whitespace-nowrap"
          />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
