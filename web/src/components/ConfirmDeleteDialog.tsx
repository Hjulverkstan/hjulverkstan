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
  onDelete: () => void;
  onCancel?: () => void;
  entity: string;
  entityId?: string;
}

export default function ConfirmDeleteDialog({
  onDelete,
  onCancel,
  entity,
  entityId,
}: confirmDeleteDialogProps) {
  const item = entity.toLowerCase();
  const id = entityId?.toLowerCase();

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{`Delete ${item}`}</DialogTitle>
        <DialogDescription>
          {`You are trying to delete a ${item} ${id ? `with id ${id}.` : ''}`}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <IconButton
            variant={'destructive'}
            type="submit"
            onClick={onDelete}
            icon={Trash2}
            text="Delete"
          />
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
