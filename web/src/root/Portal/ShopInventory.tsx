import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import * as ticketEnums from '@data/ticket/enums';
import * as locationEnums from '@data/location/enums';
import * as enums from '@data/vehicle/enums';
import {
  initVehicle,
  maxGearCount,
  minGearCount,
  vehicleZ,
} from '@data/vehicle/form';
import {
  Vehicle,
  VehicleAggregated,
  VehicleStatus,
  VehicleType,
} from '@data/vehicle/types';
import { useVehicleQ, useVehiclesAggregatedQ } from '@data/vehicle/queries';
import {
  useCreateVehicleM,
  useDeleteVehicleM,
  useEditVehicleM,
} from '@data/vehicle/mutations';
import { useLocationsAsEnumsQ, useLocationsQ } from '@data/location/queries';

import * as DataTable from '@components/DataTable';
import * as DataForm from '@components/DataForm';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { Mode } from '@components/DataForm';
import { useToast } from '@components/shadcn/use-toast';
import { Dialog, DialogTrigger } from '@components/shadcn/Dialog';
import { IconButton } from '@components/shadcn/Button';
import BadgeGroup from '@components/BadgeGroup';
import { Badge } from '@components/shadcn/Badge';
import ConfirmDeleteDialog from '@components/ConfirmDeleteDialog';
import IconLabel from '@components/IconLabel';
import { fuzzyMatchFn } from '@components/DataTable';

import PortalForm from './PortalForm';
import PortalTable from './PortalTable';
import PortalToolbar from './PortalToolbar';
import PortalContent from './PortalContent';
import { createSuccessToast, createErrorToast } from './toast';

//

const columns: Array<DataTable.Column<VehicleAggregated>> = [
  {
    key: 'regTag',
    name: 'Reg.',
    renderFn: ({ regTag }) => <Badge variant="outline">{regTag}</Badge>,
  },
  {
    key: 'location',
    name: 'Location',
    renderFn: ({ location }) => {
      const { icon } = locationEnums.find(location.locationType);

      return <BadgeGroup badges={[{ label: location.name, icon }]} />;
    },
  },
  {
    key: 'vehicleType',
    name: 'Type',
    renderFn: ({ vehicleType, bikeType, strollerType }) => (
      <IconLabel {...enums.find(vehicleType)}>
        {(strollerType || bikeType) && (
          <span className="text-muted-foreground pl-1">
            {bikeType && enums.find(bikeType).name}
            {strollerType && enums.find(strollerType).name}
          </span>
        )}
      </IconLabel>
    ),
  },
  {
    key: 'vehicleStatus',
    name: 'Status',
    renderFn: ({ vehicleStatus }) => {
      if (vehicleStatus) {
        const { icon, name: label } = enums.find(vehicleStatus);

        const variant = {
          [VehicleStatus.AVAILABLE]: 'successOutline',
          [VehicleStatus.UNAVAILABLE]: 'warnOutline',
          [VehicleStatus.BROKEN]: 'destructiveOutline',
        }[vehicleStatus] as any;

        return <BadgeGroup badges={[{ label, icon, variant }]} />;
      }
    },
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
            icon: ticketEnums.find(ticketType).icon,
          })) ?? [];

      const amountClosed = tickets?.filter((ticket) => !ticket.isOpen).length;
      const closed = amountClosed ? [{ label: amountClosed + ' closed' }] : [];

      return <BadgeGroup badges={[...open, ...closed]} />;
    },
  },
  {
    key: 'brand',
    name: 'Brand',
    renderFn: ({ brand }) => brand && <IconLabel {...enums.find(brand)} />,
  },
  {
    key: 'size',
    name: 'Size',
    renderFn: ({ size }) => size && <IconLabel {...enums.find(size)} />,
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
      brakeType && <IconLabel {...enums.find(brakeType)} />,
  },
  {
    key: 'batchCount',
    name: 'Batch count',
    renderFn: ({ batchCount }) => !!batchCount && <span>{batchCount}</span>,
  },
  {
    key: 'comment',
    name: 'Comment',
    renderFn: (row) => (
      <span className="text-muted-foreground text-elipsis">{row.comment}</span>
    ),
  },
];

// parseMutation: Depending on the vehicle type when submitting a mutation,
//   clear all fields that could of been set by another vehicle type.

const parseMutation = ({
  id,
  locationId,
  imageURL,
  ticketIds,
  comment,
  regTag,
  vehicleStatus,
  vehicleType,
  size,
  gearCount,
  brakeType,
  brand,
  bikeType,
  strollerType,
  batchCount,
}: Vehicle) => ({
  id,
  locationId: Number(locationId),
  imageURL,
  ticketIds,
  comment,
  vehicleType,
  ...(vehicleType !== VehicleType.BATCH
    ? { regTag, vehicleStatus }
    : { batchCount }),
  ...(vehicleType === VehicleType.BIKE
    ? { size, gearCount, brakeType, brand, bikeType }
    : {}),
  ...(vehicleType === VehicleType.STROLLER ? { strollerType } : {}),
});

//

export interface InventoryShopProps {
  mode: Mode;
}

export default function InventoryShop({ mode }: InventoryShopProps) {
  const { id = '' } = useParams();

  const vehiclesQ = useVehiclesAggregatedQ();
  const vehicleQ = useVehicleQ({ id });
  const createVehicleM = useCreateVehicleM();
  const editVehicleM = useEditVehicleM();
  const locationsQ = useLocationsQ(); // <Fields /> doesn't handle error/loading

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
            isLoading={vehicleQ.isLoading || locationsQ.isLoading}
            data={vehicleQ.data}
            zodSchema={vehicleZ}
            initCreateBody={initVehicle}
          >
            <PortalForm
              dataLabel="Vehicle"
              error={vehicleQ.error || locationsQ.error}
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
  const locationEnumsQ = useLocationsAsEnumsQ();
  const locationEnumMap = { locationId: locationEnumsQ.data ?? [] };

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search..."
        matchFn={(word, row: VehicleAggregated) =>
          enums.matchFn(word, row) ||
          fuzzyMatchFn(['comment', 'regTag'], word, row) ||
          word === String(row.gearCount) ||
          row.tickets.some((ticket) =>
            ticket.customerFirstName?.toLowerCase().includes(word),
          )
        }
      />
      <DataTable.FilterPopover label="Location">
        <DataTable.FilterMultiSelect
          filterKey="location"
          rowEnumAttrMap={locationEnumMap}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Type">
        <DataTable.FilterMultiSelect
          filterKey="vehicle-type"
          rowEnumAttrMap={{
            vehicleType: enums.vehicleType,
            bikeType: enums.bikeType,
            strollerType: enums.strollerType,
          }}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Status">
        <DataTable.FilterMultiSelect
          filterKey="vehicle-status"
          rowEnumAttrMap={{ vehicleStatus: enums.vehicleStatus }}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Details" hasSearch>
        <DataTable.FilterMultiSelect
          heading="Bike Size"
          filterKey="size"
          rowEnumAttrMap={{ size: enums.size }}
        />
        <DataTable.FilterMultiSelect
          heading="Brake Type"
          filterKey="brakes"
          rowEnumAttrMap={{ brakeType: enums.brakeType }}
        />
        <DataTable.FilterMultiSelect
          heading="Brand"
          filterKey="brands"
          rowEnumAttrMap={{ brand: enums.brand }}
        />
      </DataTable.FilterPopover>
    </>
  );
}

function Fields() {
  const { body, mode } = DataForm.useDataForm();
  const locationEnumsQ = useLocationsAsEnumsQ();

  return (
    <>
      {body.vehicleType !== VehicleType.BATCH && (
        <DataForm.Input
          type="string"
          placeholder="ex 'WASD'"
          label="Regtag"
          dataKey="regTag"
        />
      )}

      <DataForm.Select
        label="Location"
        dataKey="locationId"
        options={locationEnumsQ.data ?? []}
      />

      <DataForm.Select
        label="Vehicle type"
        dataKey="vehicleType"
        options={enums.vehicleType}
        disabled={mode === Mode.EDIT}
      />

      {body.vehicleType === VehicleType.STROLLER && (
        <DataForm.Select
          key={body.vehicleType}
          label="Stroller type"
          dataKey="strollerType"
          options={enums.strollerType}
        />
      )}

      {body.vehicleType === VehicleType.BATCH && (
        <DataForm.Input
          type="number"
          label="Batch count"
          dataKey="batchCount"
          placeholder={'Set number of vehicles'}
        />
      )}

      {body.vehicleType !== VehicleType.BATCH && (
        <DataForm.Select
          label="Vehicle status"
          dataKey="vehicleStatus"
          options={enums.vehicleStatus}
        />
      )}

      {body.vehicleType === VehicleType.BIKE && (
        <>
          <DataForm.Select
            key={body.vehicleType}
            label="Bike type"
            dataKey="bikeType"
            options={enums.bikeType}
          />
          <DataForm.Select
            label="Brand"
            dataKey="brand"
            options={enums.brand}
          />
          <DataForm.Select label="Size" dataKey="size" options={enums.size} />
          <DataForm.Select
            label="Brake type"
            dataKey="brakeType"
            options={enums.brakeType}
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
