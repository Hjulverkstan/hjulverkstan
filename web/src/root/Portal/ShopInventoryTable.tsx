import { useQuery } from 'react-query';
import { DotsHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';

import { vehicleStatusOptions, vehicleTypeOptions } from './dropdownOptions';
import { DataTable, type DataTableColumn } from '@components/DataTable';
import * as DropdownMenu from '@components/ui/DropdownMenu';
import { Button } from '@components/ui/Button';
import IconLabel from '@components/IconLabel';
import * as DataTableToolbar from '@components/DataTableToolbar';
import * as api from '@api';
import type { Vehicle } from '@api';

const columns: Array<DataTableColumn<Vehicle>> = [
  {
    key: 'vehicleType',
    name: 'Type',
    renderFn: ({ vehicleType }) => {
      const { name, icon } = vehicleTypeOptions.find(
        ({ value }) => value === vehicleType,
      )!;
      return <IconLabel name={name} icon={icon} />;
    },
  },
  {
    key: 'vehicleStatus',
    name: 'Status',
    renderFn: ({ vehicleStatus }) => {
      const { name, icon } = vehicleStatusOptions.find(
        ({ value }) => value === vehicleStatus,
      )!;
      return <IconLabel name={name} icon={icon} />;
    },
  },
  {
    key: 'comment',
    name: 'Comment',
    renderFn: (row) => (
      <span className="text-muted-foreground">{row.comment}</span>
    ),
  },
];

const renderRowActionFn = () => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <Button
        variant="ghost"
        className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      >
        <DotsHorizontalIcon className="h-4 w-4" />
        <span className="sr-only">Open menu</span>
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end" className="w-[160px]">
      <DropdownMenu.Item>
        Delete
        <DropdownMenu.Shortcut>⌘⌫</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

export default function ShopInventoryTable() {
  const vehiclesQ = useQuery(api.getVehicles);

  if (vehiclesQ.data)
    return (
      <DataTable
        tableKey="vehicles"
        renderRowActionFn={renderRowActionFn}
        data={vehiclesQ.data}
        columns={columns}
      >
        <DataTableToolbar.WrapperLeft>
          <DataTableToolbar.Search placeholder="Search..." />
          <DataTableToolbar.DropdownFilter
            colKey="vehicleType"
            label="Type"
            options={vehicleTypeOptions}
          />
          <DataTableToolbar.DropdownFilter
            colKey="vehicleStatus"
            label="Status"
            options={vehicleStatusOptions}
          />
        </DataTableToolbar.WrapperLeft>
        <DataTableToolbar.WrapperRight>
          <Button variant="default" className="flex h-8 w-8 p-0">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </DataTableToolbar.WrapperRight>
      </DataTable>
    );
}
