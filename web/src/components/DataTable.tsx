import {
  useState,
  createContext,
  useContext,
  ReactNode,
  ReactElement,
} from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  MixerHorizontalIcon,
} from '@radix-ui/react-icons';

import { cn } from '@utils';
import useHeadlessTable, {
  UseHeadlessTableReturn,
  Row,
} from '@hooks/useHeadlessTable';
import { Button } from '@components/ui/Button';
import Pagination from '@components/Pagination';
import * as Table from '@components/ui/Table';
import * as DropdownMenu from './ui/DropdownMenu';

//

const DataTableContext = createContext<UseHeadlessTableReturn<any> | undefined>(
  undefined,
);

/**
 * Use DataTable's data through this context hook. Must be used in a child of
 * DataTable.
 * @returns {UseHeadlessTableReturn} Since useHeadlesTable is used under the
 * hood just return the object from it
 */

export const useDataTable = <R extends Row>() => {
  const table = useContext<UseHeadlessTableReturn<R> | undefined>(
    DataTableContext,
  );

  if (!table) throw Error('useTable must be in a <TableProvider />');

  return table;
};

//

export interface DataTableColumn<R extends Row> {
  /** Column key */
  key: string;
  name: string;
  /** Override the default sort button header */
  renderHeaderFn?: () => ReactElement | string;
  /** Render the cell */
  renderFn: (
    row: R,
    metaData: { x: number; y: number },
  ) => ReactElement | string;
}

export interface DataTableProps<R extends Row> {
  /** Used for persistnace of user edited options */
  tableKey: string;
  data: R[];
  columns: Array<DataTableColumn<R>>;
  /** Provide content for the fixed right column */
  renderRowActionFn?: (
    row: R,
    metaData: { x: number; y: number },
  ) => ReactElement;
  /**
   * These children are rendered above the table, here you assemble the toolbar
   * (use the hook useDataTable() to access and interact with the table) ie.
   * construct filtering
   */
  children: ReactNode;
}

/**
 * DataTable component provides an encapsulation for reusable visuals and
 * bussiness logic.
 * @template R Row data type extending the Row interface.
 * @param {DataTableProps<R>} props - The props for the DataTable component.
 * @returns {ReactElement} The DataTable component.
 */

export const DataTable = <R extends Row>({
  tableKey: key,
  data,
  columns,
  renderRowActionFn,
  children,
}: DataTableProps<R>) => {
  const [pageSize, setPageSize] = useState(20);
  const [selected, setSelected] = useState('');
  const T = useHeadlessTable({ key, data, pageSize });

  const visibleColumns = columns.filter(
    ({ key }) => !T.hiddenCols.includes(key),
  );

  return (
    <DataTableContext.Provider value={T} key={key}>
      {children && (
        <div className="flex items-center justify-between pb-4">{children}</div>
      )}
      <Table.Root>
        <Table.Header>
          <Table.Row>
            {visibleColumns.map((col, x) => (
              <Table.Head key={col.key} className={cn(x === 0 && 'pl-4')}>
                {col.renderHeaderFn ? (
                  col.renderHeaderFn()
                ) : (
                  <DataTableSortHeader col={col} />
                )}
              </Table.Head>
            ))}
            <Table.Head className="sticky right-0 z-10 w-10 ">
              <DataTableOptions columns={columns} />
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {T.paginatedData.map((row, y) => (
            <Table.Row
              onClick={() => setSelected(row.id)}
              key={y}
              className="pl-4"
              isSelected={row.id === selected}
            >
              {visibleColumns.map(({ key, renderFn }, x) => (
                <Table.Cell key={key} className={cn(x === 0 && 'pl-4')}>
                  {renderFn(row, { x, y })}
                </Table.Cell>
              ))}
              {renderRowActionFn && (
                <Table.Cell key={key} className="z20 sticky right-0 w-10">
                  {renderRowActionFn(row, { y, x: visibleColumns.length })}
                </Table.Cell>
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <Pagination
        className="mt-4"
        page={T.page}
        pageCount={T.pageCount}
        pageSize={pageSize}
        onUpdatePageSize={setPageSize}
        onUpdatePage={T.setPage}
      />
    </DataTableContext.Provider>
  );
};

interface DataTableSortHeaderProps {
  col: DataTableColumn<any>;
}

function DataTableSortHeader({ col }: DataTableSortHeaderProps) {
  const T = useDataTable();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => T.toggleColSort(col.key)}
    >
      <span>{col.name}</span>
      {T.sortState.dir === 1 && T.sortState.key === col.key ? (
        <ArrowDownIcon className="ml-2 h-4 w-4" />
      ) : T.sortState.dir === -1 && T.sortState.key === col.key ? (
        <ArrowUpIcon className="ml-2 h-4 w-4" />
      ) : (
        <CaretSortIcon className="ml-2 h-4 w-4" />
      )}
    </Button>
  );
}

interface DataTableOptionsProps {
  columns: Array<DataTableColumn<any>>;
}

function DataTableOptions({ columns }: DataTableOptionsProps) {
  const { hiddenCols, toggleColHidden } = useDataTable();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MixerHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open view options</span>
        </Button>
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
              onCheckedChange={(e) => toggleColHidden(key)}
              disabled={checked && preventUncheck}
            >
              {name}
            </DropdownMenu.CheckboxItem>
          );
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
