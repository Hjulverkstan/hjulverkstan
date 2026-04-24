import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import { useSoftDeleteLocationM } from '@data/location/mutations';
import { Location } from '@data/location/types';

import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import ConfirmRemoveDialog from '@components/ConfirmSoftDeleteDialog';
import * as Tooltip from '@radix-ui/react-tooltip';

export default function AdminLocationsActions({
  row: location,
  disabled,
}: PortalTableActionsProps<Location>) {
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteLocationM = useSoftDeleteLocationM();

  const hasVehicles = !!location.vehicleIds.length;

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

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmRemoveDialog
        onDelete={onDelete}
        entity={location.locationType}
        entityId={location.id}
      />,
    );
  };

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <IconButton
          disabled={disabled}
          variant="ghost"
          icon={DotsHorizontalIcon}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[160px]">
        <DropdownMenu.Item
          onClick={(e) => e.stopPropagation()}
          onSelect={() => handleDeleteClick()}
        >
          Delete
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
        <Tooltip.Provider>
          <Tooltip.Root>
            {hasVehicles && (
              <Tooltip.Content className="rounded-sm bg-primary p-2 text-white">
                Location has vehicles
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
