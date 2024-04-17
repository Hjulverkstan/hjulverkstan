import {
  useState,
  useMemo,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  Cross2Icon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  MixerVerticalIcon,
} from '@radix-ui/react-icons';

import * as U from '@utils';
import * as Table from '@components/ui/Table';
import * as DropdownMenu from '@components/ui/DropdownMenu';
import { Input } from '@components/ui/Input';
import { Skeleton } from '@components/ui/Skeleton';
import { Button, IconButton } from '@components/ui/Button';
import FacetedFilterDropdown, {
  FilterOption,
} from '@components/FacetedFilterDropdown';
import useHeadlessTable, {
  UseHeadlessTableReturn,
  Row,
} from '@hooks/useHeadlessTable';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export type { Row } from '@hooks/useHeadlessTable';

//

export interface Column<R extends Row> {
  /** Column key */
  key: string;
  name: string;
  /** Override the default sort button header */
  renderHeaderFn?: () => JSX.Element | string;
  /** Render the cell */
  renderFn: (
    row: R,
    metaData: { x: number; y: number },
  ) => JSX.Element | string | null | false | undefined;
}

export interface UseDataTableReturn<R extends Row>
  extends UseHeadlessTableReturn<R> {
  disabled: boolean;
}

//

const DataTableContext = createContext<UseDataTableReturn<any> | undefined>(
  undefined,
);

/**
 * Use DataTable's data through this context hook. Must be used in a child of
 * DataTable. (it is built on useHeadlessTable)
 */

export const useDataTable = <R extends Row>() => {
  const table = useContext<UseDataTableReturn<R> | undefined>(DataTableContext);

  if (!table) throw Error('useTable must be in a <TableProvider />');

  return table;
};

export interface ProviderProps<R extends Row> {
  /** Used for persistnace of user edited options */
  tableKey: string;
  /** Is all interactivity disabled */
  disabled?: boolean;
  data?: R[];
  children: ReactNode;
}

/**
 * DataTable component provides an encapsulation for reusable visuals and
 * bussiness logic.
 */

export const Provider = <R extends Row>({
  tableKey: key,
  data = [],
  children,
  disabled = false,
}: ProviderProps<R>) => {
  const headlessTable = useHeadlessTable({ key, data, initPageSize: 20 });

  const table = useMemo(
    () => ({
      ...headlessTable,
      disabled,
    }),
    [headlessTable, disabled],
  );

  return (
    <DataTableContext.Provider value={table}>
      {children}
    </DataTableContext.Provider>
  );
};

//

export { Root } from '@components/ui/Table';

//

export interface HeaderProps {
  columns: Array<Column<any>>;
}

export function Header({ columns }: HeaderProps) {
  const { hiddenCols } = useDataTable();

  const visibleColumns = columns.filter(({ key }) => !hiddenCols.includes(key));

  return (
    <Table.Header>
      <Table.Row>
        {visibleColumns.map((col, x) => (
          <Table.Head key={col.key} className={U.cn(x === 0 && 'pl-4')}>
            {col.renderHeaderFn ? col.renderHeaderFn() : <SortHead col={col} />}
          </Table.Head>
        ))}
        <Table.Head className="sticky right-0 z-10 w-10 ">
          <HeaderOptions columns={columns} />
        </Table.Head>
      </Table.Row>
    </Table.Header>
  );
}

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
          size="sm"
          className="ml-auto"
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
              onCheckedChange={(e) => toggleColHidden(key)}
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

//

interface SortHeadProps {
  col: Column<any>;
}

export function SortHead({ col }: SortHeadProps) {
  const T = useDataTable();
  return (
    <Button
      disabled={T.disabled}
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

//

export interface BodyProps {
  columns: Array<Column<any>>;
  selected?: string;
  setSelected?: (colId: string) => void;
  /** Provide content for the fixed right column */
  renderRowActionFn?: (
    row: Record<string, any>,
    metaData: { disabled: boolean; x: number; y: number },
  ) => JSX.Element;
}

export function Body({
  columns,
  renderRowActionFn,
  selected = '',
  setSelected = () => {},
}: BodyProps) {
  const { disabled, paginatedData, hiddenCols } = useDataTable();

  const visibleColumns = columns.filter(({ key }) => !hiddenCols.includes(key));

  return (
    <Table.Body>
      {paginatedData.map((row, y) => (
        <Table.Row
          disabled={disabled}
          onClick={() => !disabled && setSelected(row.id)}
          key={row.id}
          className="pl-4"
          isSelected={row.id === selected}
        >
          {visibleColumns.map(({ key, renderFn }, x) => (
            <Table.Cell
              key={key}
              className={U.cn(x === 0 && 'pl-4', disabled && 'opacity-50')}
            >
              {renderFn(row, { x, y })}
            </Table.Cell>
          ))}
          {renderRowActionFn && (
            <Table.Cell className="z20 sticky right-0 w-10">
              {renderRowActionFn(row, {
                disabled,
                y,
                x: visibleColumns.length,
              })}
            </Table.Cell>
          )}
        </Table.Row>
      ))}
    </Table.Body>
  );
}

//

export interface BodySkeletonProps {
  columns: Array<Column<any>>;
}

export function BodySkeleton({ columns }: BodySkeletonProps) {
  const { hiddenCols } = useDataTable();

  const visibleColumns = columns.filter(({ key }) => !hiddenCols.includes(key));

  return (
    <Table.Body>
      {Array(6)
        .fill(0)
        .map((_, y) => (
          <Table.Row key={y} className="pl-4">
            {visibleColumns.map(({ key, renderFn }, x) => (
              <Table.Cell key={key} className={U.cn(x === 0 && 'pl-4')}>
                <Skeleton className="my-1 h-4 w-[100px]" />
              </Table.Cell>
            ))}
            <Table.Cell className="z20 sticky right-0 w-10"></Table.Cell>
          </Table.Row>
        ))}
    </Table.Body>
  );
}

//

export function Pagination({ children }: { children: ReactNode }) {
  const { disabled, page, pageCount, setPage } = useDataTable();

  return (
    <div className="flex h-10 items-center justify-between border-t px-2">
      {children}
      <div className="flex items-center">
        <IconButton
          variant="ghost"
          onClick={() => setPage(0)}
          disabled={disabled || page === 0}
          icon={DoubleArrowLeftIcon}
          tooltip="First page"
        />
        <IconButton
          variant="ghost"
          onClick={() => setPage(page - 1)}
          disabled={disabled || page === 0}
          icon={ChevronLeftIcon}
          tooltip="Previous page"
        />
        <IconButton
          variant="ghost"
          onClick={() => setPage(page + 1)}
          disabled={disabled || page >= pageCount - 1}
          icon={ChevronRightIcon}
          tooltip="Next page"
        />
        <IconButton
          variant="ghost"
          onClick={() => setPage(pageCount - 1)}
          disabled={disabled || page >= pageCount - 1}
          icon={DoubleArrowRightIcon}
          tooltip="Last page"
        />
      </div>
    </div>
  );
}

//

export function FilterClear() {
  const { isFiltered, clearAllFilters } = useDataTable();

  return (
    isFiltered && (
      <Button
        variant="ghost"
        onClick={clearAllFilters}
        className="h-8 px-2 lg:px-3"
      >
        Reset
        <Cross2Icon className="ml-2 h-4 w-4" />
      </Button>
    )
  );
}

//

export type SearchMatchFn = (word: string, row: Row) => boolean;

export interface FilterSearchProps {
  placeholder: string;
  matchFn: SearchMatchFn;
}

export const fuzzyMatchFn = (keys: string[], word: string, row: Row) =>
  keys.some((key) => row[key]?.toLowerCase().includes(word));

export function FilterSearch({ placeholder, matchFn }: FilterSearchProps) {
  const [value, setValue] = useState('');
  const { disabled, setFilterFn, isFiltered } = useDataTable();

  useEffect(() => {
    if (!isFiltered) setValue(''); // Clear on reset
  }, [isFiltered]);

  return (
    <Input
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={({ target: { value } }) => {
        const filterFn = (row: Row) =>
          value.split(' ').every((word) => matchFn(word.toLowerCase(), row));

        setValue(value);
        setFilterFn('ANY', !!value && filterFn);
      }}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
}

//

export interface FilterMultiSelectProps {
  /* Column key used for getting the values from data[] */
  colKey: string;
  label: string;
  options: FilterOption[];
}

export const FilterMultiSelect = ({
  colKey,
  label,
  options,
}: FilterMultiSelectProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const T = useDataTable();

  const injectedOptions = useMemo(() => {
    const filteredValues = T.filteredData.map((row) => row[colKey]);
    const totalValues = T.rawData.map((row) => row[colKey]);

    // ['bike', 'bike', 'skate'] => { bike: 2, skate: 1 }
    const valueCountMap = U.toArrayValueCountMap(filteredValues as string[]);

    return (
      options
        // remove options that are not at all in the data
        .filter((option) => totalValues.includes(option.value))
        // add data needed for FacetedFilterDropdown
        .map((option) => ({ ...option, count: valueCountMap[option.value] }))
    );
  }, [T.rawData, T.filteredData, colKey, options]);

  useEffect(() => {
    if (!T.isFiltered) setSelected([]); // Clear on reset
  }, [T.isFiltered]);

  return (
    <FacetedFilterDropdown
      label={label}
      disabled={T.disabled}
      options={injectedOptions}
      selected={selected}
      setSelected={(value) => {
        setSelected(value);
        T.setFilterFn(
          colKey,
          !!value.length &&
            ((row: Row) => value.includes(row[colKey] as string)),
        );
      }}
    />
  );
};

//
