import * as C from '@utils/common';
import * as Table from '@components/shadcn/Table';
import * as DropdownMenu from '@components/shadcn/DropdownMenu';
import { IconButton } from '@components/shadcn/Button';

import { SortHead, Column, useDataTable } from './';
import { MixerVerticalIcon } from '@radix-ui/react-icons';

export interface HeaderProps {
  columns: Array<Column<any>>;
}

export const Header = ({ columns }: HeaderProps) => {
  const { hiddenCols } = useDataTable();

  const visibleColumns = columns.filter(({ key }) => !hiddenCols.includes(key));

  return (
    <Table.Header className="sticky top-0 z-20 h-11">
      <Table.Row>
        {visibleColumns.map((col, x) => (
          <Table.Head key={col.key} className={C.cn(x === 0 && 'pl-2')}>
            {col.renderHeaderFn ? (
              col.renderHeaderFn()
            ) : (
              <SortHead colKey={col.key} colName={col.name} />
            )}
          </Table.Head>
        ))}
        <Table.Head className="sticky right-0 z-10 w-10">
          <HeaderOptions columns={columns} />
        </Table.Head>
      </Table.Row>
    </Table.Header>
  );
};

Header.displayName = 'DataTableHeader';

//

interface HeaderOptionsProps {
  columns: Array<Column<any>>;
}

function HeaderOptions({ columns }: HeaderOptionsProps) {
  const { disabled, hiddenCols, toggleColHidden, pageSize, setPageSize } =
    useDataTable();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <IconButton
          disabled={disabled}
          variant="ghost"
          className="m-auto"
          icon={MixerVerticalIcon}
          tooltip="Table options"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end" className="w-[150px]">
        <DropdownMenu.Label>Toggle columns</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {columns.map(({ key, name }) => {
          const checked = !hiddenCols.includes(key);
          const preventUncheck = columns.length - hiddenCols.length <= 2;
          return (
            <DropdownMenu.CheckboxItem
              key={key}
              className="capitalize"
              checked={checked}
              onSelect={(event) => event.preventDefault()}
              onCheckedChange={() => toggleColHidden(key)}
              disabled={checked && preventUncheck}
            >
              {name}
            </DropdownMenu.CheckboxItem>
          );
        })}
        <DropdownMenu.Label>Rows per page</DropdownMenu.Label>
        <DropdownMenu.Separator />
        {[10, 20, 50].map((value) => (
          <DropdownMenu.CheckboxItem
            key={value}
            checked={pageSize === value}
            onSelect={(event) => event.preventDefault()}
            onCheckedChange={() => setPageSize(value)}
          >
            {value}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
