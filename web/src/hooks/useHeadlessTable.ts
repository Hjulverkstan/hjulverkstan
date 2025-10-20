import { useState, useEffect, useMemo, useRef, useCallback } from 'react';

import * as C from '@utils/common';

import usePersistentState from './usePersistentState';

/** State of sorting for the table, standard traditional sort state. **/
interface SortState {
  /** The column key to sort by. */
  key: string;
  /** The direction of the sort: 0 for none, 1 for ascending, -1 for descending. */
  dir: number;
}

/** Maps filter functions by key so they can be updated individualy. */
interface FilterFunctionMap {
  [key: string]: (row: any) => boolean;
}

/** Maps column keys to their respective sorting functions. */
interface SortFunctionMap {
  [key: string]: (a: any, b: any) => number;
}

export interface Row {
  id: string;
  [attributes: string]: any;
}

/**
 * Parameters for the `useHeadlessTable` hook.
 */
export interface UseHeadlessTableParams<R extends Row> {
  /** Unique key for the table, used for state persistence. */
  key: string;
  /** Data to be displayed and managed within the table. */
  data: R[];
  initPageSize: number;
  /** Mapping of column keys to custom sorting functions. */
  sortFnMap?: SortFunctionMap;
  /** Initially hidden columns. */
  initHiddenCols?: string[];
  /** Initial sorting state. */
  initSort?: SortState;
}

/**
 * The return type of the `useHeadlessTable` hook, providing state and functions for table management.
 */
export interface UseHeadlessTableReturn<R extends Row> {
  /** Filtered, sorted and paginated data. */
  paginatedData: R[];
  /** Filtered and sorted but not paginated data. */
  sortedData: R[];
  /** Filtered but not sorted and paginated data. */
  filteredData: R[];
  /** Raw unprocessed data, tastes great and is healthy. */
  rawData: R[];
  /** Total number of pages. */
  pageCount: number;
  /** List of currently hidden columns. */
  hiddenCols: string[];
  /** Current page index */
  page: number;
  sortState: SortState;
  /** When there are no filter functions set with setFilterFn */
  isFiltered: boolean;
  /** The filter fn map is exposed to be able to derive more complex questions.
   * For instance, what is the filtered output of all filters but the filterKey
   * 'XXX'?
   */
  filterFnMap: FilterFunctionMap;
  pageSize: number;
  setPageSize: (pageSize: number) => void;
  setPage: (newPage: number) => void;
  toggleColSort: (columnKey: string) => void;
  toggleColHidden: (columnKey: string) => void;
  /**
   * Function to set a filter function, does not have to map to a column key,
   * the key is just for registering the filter fn. To clear a function pass
   * the value false.
   *
   * Important note: As a consumer of setFilterFn, you are responsible for only
   * updating a filterFn if it has new filter logic. If you set this on every
   * render, even though it has not changed. You can cause infinite render
   * loops as there are many subscribers to the filterFnMap that setFilterFn
   * updates.
   */
  setFilterFn: (key: string, filterFn: ((row: R) => boolean) | false) => void;
  /**
   * Subscribe to the clearAllFilters event that can be fired by the
   * clearAllFilters() fn. This is implemented so that a clear all filters
   * button can be used, all implemented filters which host their own state
   * can then clear themselves and clear their filterFns.
   */
  subscribeToClearAllFilters: (callback: () => void) => () => void;
  clearAllFilters: () => void;
}

/**
 * Custom hook for managing the state of a headless table, including pagination,
 * sorting, and filtering.
 *
 * @param params The configuration parameters for the hook.
 * @returns An object containing the table state and management functions.
 */

const useHeadlessTable = <R extends Row>({
  key: tableKey,
  data,
  sortFnMap = {},
  initPageSize,
  initHiddenCols = [],
  initSort = { key: '', dir: 0 },
}: UseHeadlessTableParams<R>): UseHeadlessTableReturn<R> => {
  const [page, setPageState] = useState(0);
  const [pageSize, setPageSize] = useState(initPageSize);
  const [sortState, setSortState] = useState<SortState>(initSort);
  const [filterFnMap, setFilterFnMap] = useState<FilterFunctionMap>({});

  const [hiddenCols, setHiddenCols] = usePersistentState(
    'table-' + tableKey,
    initHiddenCols,
  );

  const isFiltered = !!Object.keys(filterFnMap).length;

  //

  const filteredData = useMemo(() => {
    const filterFnList = Object.entries(filterFnMap)
      .filter(([key]) => !hiddenCols.includes(key))
      .map(([, fn]) => fn);

    return data.filter((row) => filterFnList.every((fn) => fn(row)));
  }, [data, filterFnMap, hiddenCols]);

  const sortedData = useMemo(() => {
    const { key, dir } = sortState;

    const sortFn = (a: any, b: any) =>
      (sortFnMap[key] ?? C.toSortFnByProp(key))(a, b) * dir;

    return dir === 0 ? filteredData : [...filteredData].sort(sortFn);
  }, [sortState, sortFnMap, filteredData]);

  const paginatedData = useMemo(
    () => sortedData.slice(page * pageSize, (page + 1) * pageSize),
    [page, pageSize, sortedData],
  );

  //

  const pageCount = Math.ceil(filteredData.length / pageSize);

  useEffect(() => {
    // When data shrinks and you are on a page that does not exist eny more
    if (page > pageCount - 1) setPage(pageCount - 1);
  }, [pageCount, page]);

  //

  const setPage = useCallback(
    (newPage: number) => setPageState(C.clamp(0, pageCount - 1, newPage)),
    [pageCount],
  );

  const toggleColSort = useCallback(
    (key: string) =>
      setSortState((prev) => ({
        key,
        dir: prev.key !== key ? 1 : prev.dir === 1 ? -1 : prev.dir + 1,
      })),
    [],
  );

  const toggleColHidden = useCallback(
    (key: string) =>
      setHiddenCols((list) =>
        list.includes(key) ? list.filter((el) => el !== key) : [...list, key],
      ),
    [],
  );

  const setFilterFn = useCallback(
    (key: string, filterFn: ((row: any) => boolean) | false) =>
      setFilterFnMap((obj) =>
        filterFn
          ? { ...obj, [key]: C.memoizeFn(filterFn) }
          : // Don't update filterFnMap if intention is to reset the filter and it is
            // already reset
            obj[key]
            ? C.omitKeys([key], obj)
            : obj,
      ),
    [],
  );

  //

  const listeners = useRef<(() => void)[]>([]);

  const subscribeToClearAllFilters = useCallback((callback: () => void) => {
    listeners.current.push(callback);
    return () => listeners.current.filter((fn) => fn !== callback);
  }, []);

  const clearAllFilters = useCallback(
    () => listeners.current.forEach((fn) => fn()),
    [],
  );

  return {
    rawData: data,
    setPageSize,
    pageSize,
    sortedData,
    paginatedData,
    filteredData,
    pageCount,
    hiddenCols,
    page,
    sortState,
    isFiltered,
    filterFnMap,
    setPage,
    toggleColSort,
    toggleColHidden,
    setFilterFn,
    subscribeToClearAllFilters,
    clearAllFilters,
  };
};

export default useHeadlessTable;
