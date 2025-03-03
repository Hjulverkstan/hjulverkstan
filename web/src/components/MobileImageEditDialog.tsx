import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Button, IconButton } from '@components/shadcn/Button';
import { Save, Trash2 } from 'lucide-react';
import { ChangeEvent } from 'react';

export interface MobileImageEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (event: ChangeEvent<HTMLButtonElement>) => void;
  onDelete: () => void;
  entity: string | null;
  entityId: string | null;
}

const MobileImageEditDialog: React.FC<MobileImageEditDialogProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  entity,
  entityId,
}) => {
  // Properly spells words by capitalizing the first letter, and the rest are in lowercase.
  const entityType = entity
    ?.split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{`Changing ${entityType}`}</DialogTitle>
          <DialogDescription>
            {`You are trying to change a ${entityType} with ID ${entityId}.`}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col space-y-4">
          <DialogClose asChild>
            <IconButton
              variant={'destructive'}
              type="submit"
              onClick={onEdit}
              icon={Save}
              text="Edit"
              className="h-10"
            />
          </DialogClose>
          <DialogClose asChild>
            <IconButton
              variant={'destructive'}
              type="submit"
              onClick={onDelete}
              icon={Trash2}
              text="Delete"
              className="h-10"
            />
          </DialogClose>
          <DialogClose asChild>
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="h-10"
            >
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MobileImageEditDialog;
