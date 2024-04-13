import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import * as Q from '@hooks/queries';
import * as M from '@hooks/mutations';
import * as DataTable from '@components/DataTable';
import * as DataForm from '@components/DataForm';
import * as DropdownMenu from '@components/ui/DropdownMenu';
import { Mode } from '@components/DataForm';
import { useToast } from '@components/ui/use-toast';
import { Dialog, DialogTrigger } from '@components/ui/Dialog';
import { IconButton } from '@components/ui/Button';
import BadgeGroup from '@components/BadgeGroup';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import IconLabel from '@components/IconLabel';

import PortalForm from './PortalForm';
import PortalTable from './PortalTable';
import PortalToolbar from './PortalToolbar';
import PortalContent from './PortalContent';
import { initVehicle, vehicleZ } from './data';
import { createSuccessToast, createErrorToast } from './toast';
import {
  bikeTypeOptions,
  brakeTypeOptions,
  sizeOptions,
  ticketTypeOptions,
  toLabel,
  vehicleStatusOptions,
  vehicleTypeOptions,
} from './dropdownOptions';

const columns: Array<DataTable.Column<Q.VehicleAggregated>> = [
  {
    key: 'vehicleType',
    name: 'Type',
    renderFn: ({ vehicleType, bikeType }) => (
      <IconLabel {...toLabel(vehicleTypeOptions, vehicleType)}>
        {bikeType && (
          <span className="pl-1 text-muted-foreground">
            {toLabel(bikeTypeOptions, bikeType).name}
          </span>
        )}
      </IconLabel>
    ),
  },
  {
    key: 'vehicleStatus',
    name: 'Status',
    renderFn: ({ vehicleStatus }) => (
      <IconLabel {...toLabel(vehicleStatusOptions, vehicleStatus)} />
    ),
  },
  {
    key: 'ticketIds',
    name: 'Tickets',
    renderFn: ({ tickets }) => {
      const open =
        tickets
          ?.filter((ticket) => ticket.isOpen)
          .map(({ ticketType, customerFirstName }) => ({
            variant: 'warn' as 'success',
            label: customerFirstName ?? '',
            icon: ticketTypeOptions.find(({ value }) => value === ticketType)!
              .icon,
          })) ?? [];

      const amountClosed = tickets?.filter((ticket) => !ticket.isOpen).length;
      const closed = amountClosed ? [{ label: amountClosed + ' closed' }] : [];

      return <BadgeGroup badges={[...open, ...closed]} />;
    },
  },
  {
    key: 'size',
    name: 'Size',
    renderFn: ({ size }) => <IconLabel {...toLabel(sizeOptions, size)} />,
  },
  {
    key: 'gearCount',
    name: 'Gears',
    renderFn: ({ gearCount }) => (gearCount ? String(gearCount) : null),
  },
  {
    key: 'brakeType',
    name: 'Brakes',
    renderFn: ({ brakeType }) => (
      <IconLabel {...toLabel(brakeTypeOptions, brakeType)} />
    ),
  },
  {
    key: 'comment',
    name: 'Comment',
    renderFn: (row) => (
      <span className="text-muted-foreground">{row.comment}</span>
    ),
  },
];

export interface InventoryShopProps {
  mode: Mode;
}

export default function InventoryShop({ mode }: InventoryShopProps) {
  const { id = '' } = useParams();

  const vehiclesQ = Q.useVehiclesAggregated();
  const vehicleQ = Q.useVehicle({ id });
  const createVehicleM = M.useCreateVehicle();
  const editVehicleM = M.useEditVehicle();

  const isTableDisabled = [Mode.CREATE, Mode.EDIT].includes(mode);

  return (
    <DataTable.Provider
      key="vehicles"
      tableKey="vehicles"
      disabled={isTableDisabled}
      data={vehiclesQ.data}
    >
      <PortalToolbar dataLabel="vehicle">
        <Filters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          renderRowActionFn={({ id, vehicleType }) => (
            <Actions id={id} vehicleType={vehicleType} />
          )}
          columns={columns}
          isLoading={vehiclesQ.isLoading}
          error={vehiclesQ.error}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={vehicleQ.isLoading}
            data={vehicleQ.data}
            zodSchema={vehicleZ}
            initCreateBody={initVehicle}
          >
            <PortalForm
              error={vehicleQ.error}
              isSubmitting={createVehicleM.isLoading || editVehicleM.isLoading}
              saveMutation={editVehicleM.mutateAsync}
              createMutation={createVehicleM.mutateAsync}
            >
              <Fields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}

function Filters() {
  return (
    <>
      <DataTable.FilterSearch placeholder="Search..." />
      <DataTable.FilterMultiSelect
        colKey="vehicleType"
        label="Type"
        options={vehicleTypeOptions}
      />
      <DataTable.FilterMultiSelect
        colKey="vehicleStatus"
        label="Status"
        options={vehicleStatusOptions}
      />
    </>
  );
}

function Fields() {
  return (
    <>
      <DataForm.Select
        label="Vehicle type"
        dataKey="vehicleType"
        options={vehicleTypeOptions}
      />
      <DataForm.Select
        label="Vehicle status"
        dataKey="vehicleStatus"
        options={vehicleStatusOptions}
      />
      <DataForm.Input
        placeholder="Write a comment..."
        label="Comment"
        dataKey="comment"
      />
    </>
  );
}

export interface ActionsProps {
  id: string;
  vehicleType: string;
}

export function Actions({ id, vehicleType }: ActionsProps) {
  const deleteVehicleM = M.useDeleteVehicle();

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
