import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { useDeleteVehicleM } from '@data/vehicle/mutations';
import { Vehicle, VehicleAggregated } from '@data/vehicle/types';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import { useToast } from '@components/shadcn/use-toast';
import { IconButton } from '@components/shadcn/Button';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function ShopInventoryActions({
  row: vehicle,
  disabled,
}: PortalTableActionsProps<VehicleAggregated>) {
  const deleteVehicleM = useDeleteVehicleM();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onDelete = () => {
    deleteVehicleM.mutate(vehicle.id, {
      onSuccess: (res: Vehicle) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'vehicle',
            id: res.id,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'vehicle' }));
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
            entity={vehicle.vehicleType}
            entityId={vehicle.regTag}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog>
  );
}
