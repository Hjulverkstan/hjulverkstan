import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/ui/Dialog';

import { Button } from '@components/ui/Button';

import { Dispatch, SetStateAction } from 'react';

interface confirmDeleteDialogProps {
  onDelete: () => void;

  setIsDialogOpen: Dispatch<SetStateAction<any>>;

  entity: string;

  entityId: string;
}

export default function ConfirmDeleteDialog({
  onDelete,

  setIsDialogOpen,

  entity,

  entityId,
}: confirmDeleteDialogProps) {
  const item = entity.toLowerCase();
  const id = entityId.toLowerCase();

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => setIsDialogOpen(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{`Delete ${item}`}</DialogTitle>

          <DialogDescription>
            {`You are trying to delete a ${item}.`}
          </DialogDescription>

          <DialogDescription>
            {`Click "Delete" if you want to delete ${item}: ${id}.`}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant={'outline'}
            type="submit"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>

          <Button type="button" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
