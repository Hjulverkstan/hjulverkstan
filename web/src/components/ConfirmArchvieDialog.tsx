import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { Archive } from 'lucide-react';

interface confirmDeleteDialogProps {
  onCancel?: () => void;
  onArchive?: () => void;
  entity: string;
  entityId?: string;
}

export default function ConfirmArchiveDialog({
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
        <DialogTitle className="mb-2 text-xl">{`Archive ${item}`}</DialogTitle>
        <DialogDescription className="leading-relaxed text-slate-700">
          <p className="mb-4">
            {`You are trying to archive a ${item} ${id ? `with id ${id}.` : ''}`}
          </p>

          <p>
            <strong>Archiving</strong> preserves all history and records.
          </p>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-8 flex flex-row items-center">
        <DialogClose asChild>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </DialogClose>

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
      </DialogFooter>
    </DialogContent>
  );
}
