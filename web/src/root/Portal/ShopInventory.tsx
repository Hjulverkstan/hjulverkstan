import { useParams } from 'react-router-dom';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';

import * as Q from '@hooks/queries';
import * as M from '@hooks/mutations';
import * as DataTable from '@components/DataTable';
import * as DataForm from '@components/DataForm';
import * as DropdownMenu from '@components/ui/DropdownMenu';
import { IconButton } from '@components/ui/Button';
import { Mode } from '@components/DataForm';
import { Vehicle } from '@api';

import PortalForm from './PortalForm';
import PortalTable from './PortalTable';
import PortalToolbar from './PortalToolbar';
import PortalContent from './PortalContent';
import { initVehicle, vehicleZ } from './data';
import {
  vehicleStatusOptions,
  vehicleTypeOptions,
  toLabel,
} from './dropdownOptions';

const columns: Array<DataTable.Column<Vehicle>> = [
  {
    key: 'vehicleType',
    name: 'Type',
    renderFn: ({ vehicleType }) => toLabel(vehicleTypeOptions, vehicleType),
  },
  {
    key: 'vehicleStatus',
    name: 'Status',
    renderFn: ({ vehicleStatus }) =>
      toLabel(vehicleStatusOptions, vehicleStatus),
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

  const vehiclesQ = Q.useVehicles();
  const vehicleQ = Q.useVehicle({ id });
  const createVehicleM = M.useCreateVehicle();
  const editVehicleM = M.useEditVehicle();

  console.log(333, vehicleQ.data, vehicleQ.isLoading);

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
          renderRowActionFn={({ id }) => <Actions id={id} />}
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
            initData={initVehicle}
          >
            <PortalForm
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

function Actions() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton variant="ghost" icon={DotsHorizontalIcon} />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[160px]">
        <DropdownMenu.Item>
          Delete
          <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
