import { DotsHorizontalIcon, PlusIcon } from '@radix-ui/react-icons';

import { vehicleTypeOptions } from '@components/data-table-toolbar';
import { DataTable } from '@components/data-table';
import type { DataTableColumn } from '@components/data-table';
import * as DropdownMenu from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import * as DataTableToolbar from '@components/data-table-toolbar';

// Mock data section

export interface Vehicle {
  id: string;
  tagId: string;
  comment?: string;
  type: string;
}

const fakeData: Vehicle[] = [
  {
    id: '1',
    tagId: 'UXZ',
    type: 'bike',
  },
  {
    id: '2',
    tagId: 'FRK',
    type: 'bike',
  },
  {
    id: '3',
    tagId: 'BLX',
    type: 'bike',
  },
  {
    id: '4',
    tagId: 'CRK',
    type: 'stroller',
    comment: 'Trippelvagn!',
  },
];

//

const columns: Array<DataTableColumn<Vehicle>> = [
  {
    key: 'tagId',
    name: 'Reg-nr',
    renderFn: (row) => row.tagId,
  },
  {
    key: 'type',
    name: 'Type',
    renderFn: ({ type }) => {
      const option = vehicleTypeOptions.find(({ value }) => value === type);

      return (
        <div className="flex items-center">
          {option?.icon && (
            <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{option?.name}</span>
        </div>
      );
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

export default function Inventory() {
  return (
    <DataTable
      tableKey="vehicles"
      renderRowActionFn={renderRowActionFn}
      data={fakeData}
      columns={columns}
    >
      <DataTableToolbar.WrapperLeft>
        <DataTableToolbar.Search placeholder="Search..." />
        <DataTableToolbar.VehicleType />
      </DataTableToolbar.WrapperLeft>
      <DataTableToolbar.WrapperRight>
        <Button variant="default" className="flex h-8 w-8 p-0">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </DataTableToolbar.WrapperRight>
    </DataTable>
  );
}
