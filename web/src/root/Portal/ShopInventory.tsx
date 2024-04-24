import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import * as U from '@utils';
import * as Q from '@hooks/queries';
import * as M from '@hooks/mutations';
import { Vehicle, VehicleType } from '@api';
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
import { fuzzyMatchFn } from '@components/DataTable';
import { VehicleAggregated } from '@hooks/queries';
import { toLabel, enumMatchFn } from '@enums';
import * as enums from '@enums';

import PortalForm from './PortalForm';
import PortalTable from './PortalTable';
import PortalToolbar from './PortalToolbar';
import PortalContent from './PortalContent';
import { initVehicle, maxGearCount, minGearCount, vehicleZ } from './data';
import { createSuccessToast, createErrorToast } from './toast';

//

const columns: Array<DataTable.Column<VehicleAggregated>> = [
  {
    key: 'vehicleType',
    name: 'Type',
    renderFn: ({ vehicleType, bikeType, strollerType }) => (
      <IconLabel {...toLabel(enums.vehicle.vehicleType, vehicleType)}>
        {(strollerType || bikeType) && (
          <span className="text-muted-foreground pl-1">
            {bikeType && toLabel(enums.vehicle.bikeType, bikeType).name}
            {strollerType &&
              toLabel(enums.vehicle.strollerType, strollerType).name}
          </span>
        )}
      </IconLabel>
    ),
  },
  {
    key: 'vehicleStatus',
    name: 'Status',
    renderFn: ({ vehicleStatus }) => (
      <IconLabel {...toLabel(enums.vehicle.vehicleStatus, vehicleStatus)} />
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
            variant: 'warn' as 'warn',
            label: customerFirstName ?? '',
            icon: enums.ticket.type.find(({ value }) => value === ticketType)!
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
    renderFn: ({ size }) =>
      size && <IconLabel {...toLabel(enums.vehicle.size, size)} />,
  },
  {
    key: 'gearCount',
    name: 'Gears',
    renderFn: ({ gearCount }) =>
      !!gearCount && (
        <span className={gearCount === 1 ? 'opacity-50' : ''}>{gearCount}</span>
      ),
  },
  {
    key: 'brakeType',
    name: 'Brakes',
    renderFn: ({ brakeType }) =>
      brakeType && (
        <IconLabel {...toLabel(enums.vehicle.brakeType, brakeType)} />
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

// parseMutation: Depending on the vehicle type when submitting a mutation,
//   clear all fields that could of been set by another vehicle type.

const vehicleTypePropsMap = {
  [VehicleType.BIKE]: ['vehicleType', 'size', 'gearCount', 'brakeType'],
  [VehicleType.SCOOTER]: ['scooterType'],
  [VehicleType.STROLLER]: ['strollerType'],
};

const parseMutation = (body: Vehicle) =>
  U.omitKeys(
    Object.entries(vehicleTypePropsMap)
      .map(([type, keys]) => (type !== body.vehicleType ? keys : []))
      .flat(),
    body,
  );

//

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
              dataLabel="Vehicle"
              error={vehicleQ.error}
              isSubmitting={createVehicleM.isLoading || editVehicleM.isLoading}
              saveMutation={editVehicleM.mutateAsync}
              createMutation={createVehicleM.mutateAsync}
              transformBodyOnSubmit={parseMutation}
            >
              <Fields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}

//

function Filters() {
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search..."
        matchFn={(word, row: VehicleAggregated) =>
          enumMatchFn(enums.vehicle, word, row) ||
          fuzzyMatchFn(['comment'], word, row) ||
          word === String(row.gearCount) ||
          row.tickets.some((ticket) =>
            ticket.customerFirstName?.toLowerCase().includes(word),
          )
        }
      />
      <DataTable.PopoverFilterRoot label="Type">
        <DataTable.FilterMultiSelect
          filterKey="vehicle-type"
          rowEnumAttrMap={{
            vehicleType: enums.vehicle.vehicleType,
            bikeType: enums.vehicle.bikeType,
            strollerType: enums.vehicle.strollerType,
          }}
        />
      </DataTable.PopoverFilterRoot>
      <DataTable.PopoverFilterRoot label="Status">
        <DataTable.FilterMultiSelect
          filterKey="vehicle-status"
          rowEnumAttrMap={{ vehicleStatus: enums.vehicle.vehicleStatus }}
        />
      </DataTable.PopoverFilterRoot>
      <DataTable.PopoverFilterRoot label="Details">
        <DataTable.FilterMultiSelect
          heading="Bike Size"
          filterKey="size"
          rowEnumAttrMap={{ size: enums.vehicle.size }}
        />
        <DataTable.FilterMultiSelect
          heading="Brake Type"
          filterKey="brakes"
          rowEnumAttrMap={{ brakeType: enums.vehicle.brakeType }}
        />
      </DataTable.PopoverFilterRoot>
    </>
  );
}

function Fields() {
  const { body, mode } = DataForm.useDataForm();

  return (
    <>
      <DataForm.Select
        label="Vehicle type"
        dataKey="vehicleType"
        options={enums.vehicle.vehicleType}
        disabled={mode === Mode.EDIT}
      />
      {body.vehicleType === VehicleType.BIKE && (
        <DataForm.Select
          key={body.vehicleType}
          label="Bike type"
          dataKey="bikeType"
          options={enums.vehicle.bikeType}
        />
      )}
      {body.vehicleType === VehicleType.STROLLER && (
        <DataForm.Select
          key={body.vehicleType}
          label="Stroller type"
          dataKey="strollerType"
          options={enums.vehicle.strollerType}
        />
      )}
      {body.vehicleType === VehicleType.STROLLER && (
        <DataForm.Select
          key={body.vehicleType}
          label="Stroller type"
          dataKey="strollerType"
          options={enums.vehicle.strollerType}
        />
      )}
      <DataForm.Select
        label="Vehicle status"
        dataKey="vehicleStatus"
        options={enums.vehicle.vehicleStatus}
      />
      {body.vehicleType === VehicleType.BIKE && (
        <>
          <DataForm.Select
            label="Size"
            dataKey="size"
            options={enums.vehicle.size}
          />
          <DataForm.Select
            label="Brake type"
            dataKey="brakeType"
            options={enums.vehicle.brakeType}
          />
          <DataForm.Input
            type="number"
            placeholder="Set gear count"
            min={minGearCount}
            max={maxGearCount}
            label="Gears"
            dataKey="gearCount"
            description="Gear count (ie 21 for 3x7)"
          />
        </>
      )}
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
