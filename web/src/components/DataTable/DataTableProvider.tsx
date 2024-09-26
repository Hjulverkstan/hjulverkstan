import {
  useContext,
  createContext,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';

import useHeadlessTable, {
  UseHeadlessTableReturn,
} from '@hooks/useHeadlessTable';

import { Row } from './';

//

export interface UseDataTableReturn<R extends Row>
  extends UseHeadlessTableReturn<R> {
  disabled: boolean;
}

const DataTableContext = createContext<UseDataTableReturn<any> | undefined>(
  undefined,
);

/**
 * Use DataTable's data through this context hook. Must be used in a child of
 * DataTable. (it is built on useHeadlessTable)
 */

interface UseDataTableProps {
  onClearAllFilters?: () => void;
}

export const useDataTable = <R extends Row>(
  { onClearAllFilters } = {} as UseDataTableProps,
) => {
  const table = useContext<UseDataTableReturn<R> | undefined>(DataTableContext);

  if (!table) throw Error('useTable must be in a <TableProvider />');

  useEffect(() => {
    if (onClearAllFilters)
      return table.subscribeToClearAllFilters(onClearAllFilters);
  }, []);

  return table;
};

//

export interface ProviderProps<R extends Row> {
  /** Used for persistnace of user edited options */
  tableKey: string;
  /** Is all interactivity disabled */
  disabled?: boolean;
  data?: R[];
  children: ReactNode;
}

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

Provider.displayName = 'DataTableProvider';
