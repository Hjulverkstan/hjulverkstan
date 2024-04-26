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
  PlusCircledIcon,
} from '@radix-ui/react-icons';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import * as U from '@utils';
import * as Table from '@components/ui/Table';
import * as DropdownMenu from '@components/ui/DropdownMenu';
import * as Popover from '@components/ui/Popover';
import * as Command from '@components/ui/Command';
import { EnumAttributes, RowEnumAttrMap } from '@enums';
import { Input } from '@components/ui/Input';
import { Skeleton } from '@components/ui/Skeleton';
import { Button, IconButton } from '@components/ui/Button';
import MulitSelect from '@components/MultiSelect';
import useHeadlessTable, {
  UseHeadlessTableReturn,
  Row,
} from '@hooks/useHeadlessTable';

import { Separator } from './ui/Separator';
import { Badge } from './ui/Badge';

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
    <Table.Header className="sticky top-0 z-20">
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

//

interface SortHeadProps {
  col: Column<any>;
}

export function SortHead({ col }: SortHeadProps) {
  const T = useDataTable();

  const Icon =
    (T.sortState.key === col.key &&
      ((T.sortState.dir === 1 && ArrowDownIcon) ||
        (T.sortState.dir === -1 && ArrowUpIcon))) ||
    CaretSortIcon;

  return (
    <Button
      disabled={T.disabled}
      variant="ghost"
      className="data-[state=open]:bg-accent -ml-3 h-8"
      onClick={() => T.toggleColSort(col.key)}
    >
      {col.name}
      <Icon className="ml-2" />
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
            <Table.Cell className="z20 sticky right-0 w-10 px-2">
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
            {visibleColumns.map(({ key }, x) => (
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
    <div className="flex h-10 items-center justify-between border-t p-2">
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
      <IconButton
        variant="ghost"
        onClick={clearAllFilters}
        text="Reset"
        className="h-8 px-2 lg:px-3"
        icon={Cross2Icon}
      />
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

export interface UsePopoverFilterReturn {
  setActiveLabels: (filterKey: string, labels: string[]) => void;
}

const PopoverFilterContext = createContext<UsePopoverFilterReturn | undefined>(
  undefined,
);

export const usePopoverFilter = () => {
  const context = useContext(PopoverFilterContext);

  if (!context)
    throw new Error(
      'usePopoverFilter must be a decendant of <PopoverFilter />',
    );

  return context;
};

export interface PopoverFilterProps {
  label: string;
  children: ReactNode;
  hasSearch?: boolean;
}

export function PopoverFilterRoot({
  label,
  children,
  hasSearch,
}: PopoverFilterProps) {
  const { disabled, setFilterFn } = useDataTable();

  const [activeLabelsMap, setActiveLabelsMap] = useState<
    Record<string, string[]>
  >({});

  const setActiveLabels = (filterKey: string, labels: string[]) =>
    setActiveLabelsMap({ ...activeLabelsMap, [filterKey]: labels });

  const activeLabels = Object.values(activeLabelsMap).flat();
  const isActive = !!activeLabels.length;
  const filterKeys = Object.keys(activeLabelsMap);

  const resetFilters = () =>
    filterKeys.forEach((filterKey) => setFilterFn(filterKey, false));

  // We want to manually control open but passing persistMount to
  // <Popover.Content />. If the content was unmounted when closed our state
  // logic and useEffect would not work.

  const [isOpen, setIsOpen] = useState(false);

  return (
    <PopoverFilterContext.Provider value={{ setActiveLabels }}>
      <Popover.Root onOpenChange={setIsOpen} open={isOpen}>
        <Popover.Trigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            className={U.cn(!isActive && 'border-dashed')}
          >
            {!isActive && <PlusCircledIcon className="mr-2 h-4 w-4" />}
            {label}
            {isActive && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <div className="ml--1 space-x-1 lg:flex">
                  <Badge
                    borderless
                    variant="secondary"
                    className="rounded-sm px-1 font-normal lg:hidden"
                  >
                    {activeLabels.length}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {activeLabels.length > 2 ? (
                      <Badge
                        borderless
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {activeLabels.length}
                      </Badge>
                    ) : (
                      activeLabels.map((label, i) => (
                        <Badge
                          borderless
                          variant="secondary"
                          key={i}
                          className="rounded-sm px-1 font-normal"
                        >
                          {label}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </Button>
        </Popover.Trigger>
        <Popover.Content
          className="w-[200px] p-0"
          align="start"
          persistMount
          isOpen={isOpen}
        >
          <Command.Root>
            {hasSearch && <Command.Input placeholder="Search" />}
            <Command.List>
              <Command.Empty>No results found.</Command.Empty>
              {children}
              {isActive && (
                <>
                  <Command.Separator />
                  <Command.Group>
                    <Command.Item
                      onSelect={resetFilters}
                      className="justify-center text-center"
                    >
                      Clear filters
                    </Command.Item>
                  </Command.Group>
                </>
              )}
            </Command.List>
          </Command.Root>
        </Popover.Content>
      </Popover.Root>
    </PopoverFilterContext.Provider>
  );
}

//

export interface FilterMultiSelectProps {
  /* Used to register the built in filter function with DataTable */
  filterKey: string;
  /* A map of which enums should be used but under what dataKey they are
   * found on a row. This is then flattened but since this component is
   * responsible for connecting with data from DataTable it needs the dataKey.
   */
  rowEnumAttrMap: RowEnumAttrMap;
  heading?: string;
}

export const FilterMultiSelect = ({
  filterKey,
  rowEnumAttrMap,
  heading,
}: FilterMultiSelectProps) => {
  const { setActiveLabels } = usePopoverFilter();
  const { filterFnMap, setFilterFn, rawData } = useDataTable();
  const [selected, setSelected] = useState<string[]>([]);

  // Create flat enums and extend data on them

  const flatEnumsAggregated = useMemo(() => {
    const { [filterKey]: _, ...filterFnMapOthers } = filterFnMap;

    const filterFnOtherFilters = (row: Row) =>
      Object.values(filterFnMapOthers).every((fn) => fn(row));

    const filteredData = rawData.filter(filterFnOtherFilters);

    const toAggregatedEnums = (dataKey: string, enums: EnumAttributes[]) =>
      enums.map((e) => ({
        ...e,
        dataKey,
        count: U.occurencesOfElInArray(
          e.value,
          filteredData.map((row) => row[dataKey]).filter((x) => x),
        ),
      }));

    return (
      Object.entries(rowEnumAttrMap)
        // Flatten and count occurences using the key from the RowEnumAttrMap
        .reduce<ReturnType<typeof toAggregatedEnums>>(
          (acc, [dataKey, enums]) =>
            acc.concat(toAggregatedEnums(dataKey, enums)),
          [],
        )
        .filter((e) => rawData.some((row) => row[e.dataKey] === e.value))
    );
  }, [rowEnumAttrMap, rawData, filterFnMap]);

  // Connect with <PopoverFilterRoot /> and its activeFilters

  useEffect(
    () =>
      setActiveLabels(
        filterKey,
        selected.map(
          (value) => flatEnumsAggregated.find((e) => e.value === value)!.name,
        ),
      ),
    [selected, flatEnumsAggregated],
  );

  // Connect with DataTable filterFn api

  useEffect(() => {
    if (!filterFnMap[filterKey]) setSelected([]); // Clear on reset
  }, [filterFnMap[filterKey]]);

  useEffect(() => {
    const filterFn = (row: any) =>
      selected.some((value) => {
        const enumAttr = flatEnumsAggregated.find((e) => e.value === value)!;

        return row[enumAttr.dataKey] === enumAttr.value;
      });

    setFilterFn(filterKey, !!selected.length && filterFn);
  }, [selected]);

  //

  return (
    <MulitSelect
      enums={flatEnumsAggregated}
      selected={selected}
      setSelected={setSelected}
      heading={heading}
    />
  );
};

//
