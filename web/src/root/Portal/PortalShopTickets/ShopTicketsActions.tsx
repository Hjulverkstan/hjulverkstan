import { CheckIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { useState } from 'react';

import {
  useDeleteTicketM,
  useUpdateTicketStatusM,
} from '@data/ticket/mutations';
import {
  NotificationStatus,
  Ticket,
  TicketAggregated,
  TicketStatus,
  TicketType,
  ticketTypeToTicketStatus,
} from '@data/ticket/types';
import * as enumsRaw from '@data/ticket/enums';

import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import { IconButton } from '@components/shadcn/Button';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { useToast } from '@components/shadcn/use-toast';
import { useDialogManager } from '@components/DialogManager';

import UpdateVehicleStatusesDialog from '@components/UpdateVehicleStatusesDialog';
import { useVehiclesQ } from '@data/vehicle/queries';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum } from '@utils/enums';
import ConfirmSendNotificationDialog from '@components/ConfirmSendNotificationDialog';
import { useCustomerQ } from '@data/customer/queries';

import {
  createErrorToast,
  createRepairNotificationErrorToast,
  createSuccessToast,
} from '../toast';
import { PortalTableActionsProps } from '../PortalTable';

export default function ShopTicketsActions({
  row: ticket,
  disabled,
}: PortalTableActionsProps<TicketAggregated>) {
  const enums = useTranslateRawEnums(enumsRaw);
  const { openDialog } = useDialogManager();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const deleteTicketM = useDeleteTicketM();
  const updateTicketStatusM = useUpdateTicketStatusM();

  const vehiclesQ = useVehiclesQ();
  const customerQ = useCustomerQ({ id: ticket.customerId });

  const vehicles =
    vehiclesQ.data?.filter((vehicle) =>
      ticket.vehicleIds.includes(vehicle.id),
    ) ?? [];

  const onDelete = () => {
    deleteTicketM.mutate(ticket.id, {
      onSuccess: (res: Ticket) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'ticket',
            id: res.id,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'ticket' }));
      },
    });
  };

  const handleDeleteClick = () => {
    openDialog(
      <ConfirmDeleteDialog
        onDelete={onDelete}
        entity={ticket.ticketType}
        entityId={ticket.id}
      />,
    );
  };

  const ensureVehicleStatuses = (ticketStatus?: TicketStatus) => {
    const notCustomerOwnedVehicles = vehicles.filter(
      (vehicle) => !vehicle.isCustomerOwned,
    );

    if (
      ticketStatus === TicketStatus.CLOSED &&
      (ticket.ticketType === TicketType.RENT ||
        ticket.ticketType === TicketType.REPAIR) &&
      notCustomerOwnedVehicles.length > 0
    ) {
      openDialog(
        <UpdateVehicleStatusesDialog vehicles={notCustomerOwnedVehicles} />,
      );
    }
  };

  const doUpdateStatus = (ticketStatus: TicketStatus) => {
    updateTicketStatusM.mutate(
      { id: ticket.id, ticketStatus },
      {
        onSuccess: (res, { id }) => {
          if (res.repairCompleteNotificationStatus === NotificationStatus.FAILED) {
            toast(createRepairNotificationErrorToast());
          } else {
            toast(
              createSuccessToast({
                verbLabel: 'update status on',
                dataLabel: 'ticket',
                id,
              }),
            );
          }

          ensureVehicleStatuses(res.ticketStatus);
        },
        onError: () => {
          toast(
            createErrorToast({
              verbLabel: 'update status on',
              dataLabel: 'ticket',
            }),
          );
        },
      },
    );
  };

  const onStatusUpdate = (ticketStatus: TicketStatus) => {
    const shouldAskConfirmation =
      ticketStatus === TicketStatus.COMPLETE &&
      ticket.ticketType === TicketType.REPAIR;

    if (shouldAskConfirmation) {
      openDialog(
        <ConfirmSendNotificationDialog
          onSend={() => doUpdateStatus(ticketStatus)}
          phoneNumber={customerQ.data!.phoneNumber}
        />,
      );
    } else {
      doUpdateStatus(ticketStatus);
    }
  };

  const allowedStatuses = ticketTypeToTicketStatus(ticket.ticketType);

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

        {allowedStatuses?.length && (
          <DropdownMenu.Sub>
            <DropdownMenu.Separator />
            <DropdownMenu.SubTrigger>Status</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              {allowedStatuses.map((ticketStatus) => (
                <DropdownMenu.Item
                  key={ticketStatus}
                  onSelect={() => onStatusUpdate(ticketStatus)}
                  disabled={
                    ticketStatus === ticket.ticketStatus ||
                    !customerQ.data ||
                    !vehiclesQ.data
                  }
                >
                  {findEnum(enums, ticketStatus).label}
                  {ticketStatus === ticket.ticketStatus && (
                    <span className="ml-auto">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
