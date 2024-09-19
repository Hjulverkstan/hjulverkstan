import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';

import {
  useDeleteVehicleM,
  useUpdateVehicleStatusM,
} from '@data/vehicle/mutations';
import { Vehicle, VehicleStatus, VehicleType } from '@data/vehicle/types';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { IconButton } from '@components/shadcn/Button';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { createErrorToast, createSuccessToast } from '../toast';
import { PortalTableActionsProps } from '../PortalTable';
import * as Tooltip from '@radix-ui/react-tooltip';
import { vehicleStatus } from '@data/vehicle/enums';

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
  const { openDialog } = useDialogManager();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();
  const deleteVehicleM = useDeleteVehicleM();
  const updateVehicleStatusM = useUpdateVehicleStatusM();

  const [open, setOpen] = useState(false);

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

  const handleDeleteClick = () =>
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        entity={vehicle.vehicleType}
        entityId={
          vehicle.vehicleType === VehicleType.BATCH
            ? 'Batch'
            : vehicle.regTag || vehicle.id
        }
      />,
    );

  const onStatusUpdate = (newStatus: VehicleStatus) => {
    updateVehicleStatusM.mutate(
      { id: vehicle.id, vehicleStatus: newStatus },
      {
        onSuccess: (res: Vehicle) => {
          toast(
            createSuccessToast({
              verbLabel: 'update status on',
              dataLabel: 'vehicle',
              id: res.id,
            }),
          );
        },
        onError: () => {
          toast(
            createErrorToast({
              verbLabel: 'update status on',
              dataLabel: 'vehicle',
            }),
          );
        },
      },
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
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger>
              <DropdownMenu.Item
                onClick={(e) => e.stopPropagation()}
                onSelect={handleDeleteClick}
                disabled={hasTickets}
              >
                Delete
                <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
              </DropdownMenu.Item>
            </Tooltip.Trigger>
            {hasTickets && (
              <Tooltip.Content className="bg-primary text-white">
                Delete ticket first.
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
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
          disabled={!hasTickets}
        >
          See Tickets
        </DropdownMenu.Item>

        {vehicle.vehicleStatus !== VehicleStatus.ARCHIVED && (
          <DropdownMenu.Item
            onClick={(e) => {
              e.stopPropagation();
              onStatusUpdate(VehicleStatus.ARCHIVED);
            }}
          >
            Archive
          </DropdownMenu.Item>
        )}

        {vehicle.vehicleStatus == VehicleStatus.ARCHIVED && (
          <DropdownMenu.Item
            onClick={(e) => {
              e.stopPropagation();
              onStatusUpdate(VehicleStatus.ARCHIVED);
            }}
          >
            Unarchive
          </DropdownMenu.Item>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
