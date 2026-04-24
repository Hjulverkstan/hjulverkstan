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

interface DeleteVehicleProps {
  onCancel?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  entity: string;
  entityId?: string;
}

export default function DeleteVehicleDialog({
  onCancel,
  onArchive,
  onDelete,
  entity,
  entityId,
}: DeleteVehicleProps) {
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
            {`You are trying to delete vehicle ${item ? `with id ${id}` : 'this vehicle'}.`}
          </p>
          <div className="space-y-4">
            <p>
              <strong>Archive</strong> sets the status to archived – the
              recommended action (vehicle lost, broken beyond repair, given away
              etc.)
            </p>
            <p>
              <strong>Delete</strong> is unfavourable as the intent is to
              preserve history for vehicles.
              <strong>
                {' '}
                Only use when the vehicle is incorrect and should not be
                preserved.
              </strong>
            </p>
          </div>
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="mt-6 flex flex-row items-center justify-between">
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
              icon={Archive}
              text="Archive"
              onClick={onArchive}
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
