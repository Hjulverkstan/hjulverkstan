import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { Trash2, Archive } from 'lucide-react';

interface confirmDeleteDialogProps {
  onDelete: () => void;
  onCancel?: () => void;
  onArchive?: () => void;
  entity: string;
  entityId?: string;
}

export default function ConfirmDeleteDialog({
  onDelete,
  onCancel,
  entity,
  entityId,
  onArchive,
}: confirmDeleteDialogProps) {
  const item = entity.toLowerCase();
  const id = entityId?.toLowerCase();

  return (
    <DialogContent className="max-w-[600px] p-6 text-left">
      <DialogHeader>
        <DialogTitle className="mb-2 text-xl">{`Delete ${item}`}</DialogTitle>
        <DialogDescription className="leading-relaxed text-slate-700">
          <p className="mb-4">
            {`You are trying to delete a ${item} ${id ? `with id ${id}.` : ''}`}
          </p>

          <p>
            <strong>Archiving</strong> preserves all repair history and records.
            <strong> Deleting</strong> is <strong>permanent </strong>and should
            only be used if this {item} was created by mistake.
          </p>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-8 flex flex-row items-center justify-between">
        <DialogClose asChild>
          <Button
            variant="outline"
            type="button"
            onClick={onCancel}
            className={'mr-auto'}
          >
            Cancel
          </Button>
        </DialogClose>

        <div className="flex gap-3">
          <DialogClose asChild>
            <IconButton
              variant={'default'}
              type="button"
              onClick={onArchive}
              icon={Archive}
              text="Archive"
              className="whitespace-nowrap"
            />
          </DialogClose>

          <DialogClose asChild>
            <IconButton
              variant={'red'}
              type="button"
              onClick={onDelete}
              icon={Trash2}
              text="Permanent Delete"
              className="whitespace-nowrap"
            />
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
