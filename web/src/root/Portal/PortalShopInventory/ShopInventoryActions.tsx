import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';

import { useDeleteVehicleM } from '@data/vehicle/mutations';
import { Vehicle, VehicleType } from '@data/vehicle/types';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import { useToast } from '@components/shadcn/use-toast';
import { IconButton } from '@components/shadcn/Button';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';

import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import * as Tooltip from '@radix-ui/react-tooltip';

export enum VehicleShortcutAction {
  CREATE_TICKET = 'CREATE_TICKET',
  FILTER_BY_VEHICLE = 'FILTER_BY_VEHICLE',
}

export interface VehicleShortcutLocationState {
  action: VehicleShortcutAction;
  vehicleId: string;
}

export default function ShopInventoryActions({
  row: vehicle,
  disabled,
}: PortalTableActionsProps<Vehicle>) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const deleteVehicleM = useDeleteVehicleM();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const hasTickets = !!vehicle.ticketIds.length;

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
          <Tooltip.Provider>
            <Tooltip.Root>
              <Tooltip.Trigger>
                <DialogTrigger asChild>
                  <DropdownMenu.Item
                    onClick={(e) => e.stopPropagation()}
                    onSelect={(e) => e.preventDefault()}
                    disabled={hasTickets}
                  >
                    Delete
                    <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                </DialogTrigger>
              </Tooltip.Trigger>

              {hasTickets && (
                <Tooltip.Content className="bg-primary text-white">
                  Delete ticket first.
                </Tooltip.Content>
              )}
            </Tooltip.Root>
          </Tooltip.Provider>

          <ConfirmDeleteDialog
            onDelete={onDelete}
            onCancel={() => setOpen(false)}
            entity={vehicle.vehicleType}
            entityId={
              vehicle.vehicleType === VehicleType.BATCH
                ? 'Batch'
                : vehicle.regTag
            }
          />

          <DropdownMenu.Separator />

          <DropdownMenu.Item
            onClick={(e) => {
              e.stopPropagation();
              navigate((id ? '../..' : '..') + '/ticketz/create', {
                state: {
                  vehicleId: vehicle.id,
                  action: VehicleShortcutAction.CREATE_TICKET,
                },
              });
            }}
          >
            Create ticket
          </DropdownMenu.Item>

          <DropdownMenu.Item
            onClick={(e) => {
              e.stopPropagation();
              navigate((id ? '../..' : '..') + '/ticketz/', {
                state: {
                  vehicleId: vehicle.id,
                  action: VehicleShortcutAction.FILTER_BY_VEHICLE,
                },
              });
            }}
          >
            See Tickets
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog>
  );
}
