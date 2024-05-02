import { useState } from 'react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import { TicketType } from '@data/ticket/types';
import { useDeleteTicketM } from '@data/ticket/mutations';
import { Ticket } from '@data/ticket/types';

import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import { useToast } from '@components/shadcn/use-toast';
import { IconButton } from '@components/shadcn/Button';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';

import { createErrorToast, createSuccessToast } from '../toast';

export interface ShopTicketsActionsProps {
  id: string;
  ticketType: TicketType;
}

export default function ShopTicketsActions({
  id,
  ticketType,
}: ShopTicketsActionsProps) {
  const deleteTicketM = useDeleteTicketM();

  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const onDelete = () => {
    deleteTicketM.mutate(id, {
      onSuccess: (ticket: Ticket) => {
        toast(
          createSuccessToast({
            verbLabel: 'delete',
            dataLabel: 'ticket',
            id: ticket.id,
          }),
        );
      },
      onError: () => {
        toast(createErrorToast({ verbLabel: 'delete', dataLabel: 'ticket' }));
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
            entity={ticketType}
            entityId={id}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Dialog>
  );
}
