import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { useDeleteVehicleM } from '@data/vehicle/mutations';
import { Vehicle } from '@data/vehicle/types';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import { useToast } from '@components/shadcn/use-toast';
import { IconButton } from '@components/shadcn/Button';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';

import { createErrorToast, createSuccessToast } from '../toast';

export interface ShopInventoryActionsProps {
  id: string;
  vehicleType: string;
}

export default function ShopInventoryActions({
  id,
  vehicleType,
}: ShopInventoryActionsProps) {
  const deleteVehicleM = useDeleteVehicleM();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onDelete = () => {
    deleteVehicleM.mutate(id, {
      onSuccess: (vehicle: Vehicle) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'vehicle',
            id: vehicle.id,
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
          <IconButton variant="ghost" icon={DotsHorizontalIcon} />
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
            entity={vehicleType}
            entityId={id}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog>
  );
}
