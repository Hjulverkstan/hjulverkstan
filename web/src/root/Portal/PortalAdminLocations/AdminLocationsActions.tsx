import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useDeleteLocationM } from '@data/location/mutations';
import { Location } from '@data/location/types';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function ShopLocationsActions({
  row: location,
  disabled,
}: PortalTableActionsProps<Location>) {
  const deleteLocationM = useDeleteLocationM();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onDelete = () => {
    deleteLocationM.mutate(location.id, {
      onSuccess: (res: Location) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'location',
            id: res.name,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'location' }));
      },
    });
  };

  return (
    <Dialog>
      <DropdownMenu.Root open={open} onOpenChange={setOpen}>
        <DropdownMenu.Trigger asChild>
          <IconButton
            disabled={disabled}
            variant="ghost"
            icon={DotsHorizontalIcon}
          />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" className="w-[160px]">
          <DialogTrigger asChild>
            <DropdownMenu.Item
              onClick={(e) => e.stopPropagation()}
              onSelect={(e) => e.preventDefault()}
            >
              Delete
              <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DialogTrigger>
          <ConfirmDeleteDialog
            onDelete={onDelete}
            onCancel={() => setOpen(false)}
            entity={location.locationType}
            entityId={location.id}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog>
  );
}
