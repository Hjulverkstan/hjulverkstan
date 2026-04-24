import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { Trash2, Ghost } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface confirmDeleteDialogProps {
  onHardDelete?: () => void;
  onCancel?: () => void;
  onDelete?: () => void;
  disable?: boolean;
  entity: string;
  entityId?: string;
}

export default function ConfirmDeleteDialog({
  onHardDelete,
  onCancel,
  entity,
  entityId,
  onDelete,
  disable,
}: confirmDeleteDialogProps) {
  const item = entity.toLowerCase();
  const id = entityId?.toLowerCase();

  return (
    <DialogContent className="max-w-[600px] p-6 text-left">
      <DialogHeader>
        <DialogTitle className="mb-2 text-xl">
          {'Choose delete method'}
        </DialogTitle>
        <DialogDescription className="leading-relaxed text-slate-700">
          <p className="mb-4">
            {`You are trying to delete ${item} ${id ? `with id ${id}.` : ''}`}
          </p>
          <p>
            <strong>Delete</strong> removes the customer but keeps history on
            vehicles and tickets (repair descriptions and vehicle images).
            <br />
            <br />
            <strong>Erase</strong> is permanent and irreversible in accordance
            with GDPR; all data on vehicles and tickets is removed.
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
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <DialogClose asChild>
                  <IconButton
                    variant={'red'}
                    type="button"
                    onClick={onDelete}
                    icon={Trash2}
                    text="Remove"
                    className="whitespace-nowrap"
                    disabled={disable}
                  />
                </DialogClose>
              </Tooltip.Trigger>
              {disable && (
                <Tooltip.Content
                  className="rounded-sm bg-primary p-2 text-white"
                >
                  Delete ticket first.
                </Tooltip.Content>
              )}
            </Tooltip.Root>
          </Tooltip.Provider>

          <DialogClose asChild>
            <IconButton
              variant={'erase'}
              type="button"
              onClick={onHardDelete}
              icon={Ghost}
              text="Erase"
              className="whitespace-nowrap"
            />
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  );
}
