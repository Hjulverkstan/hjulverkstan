import React, { useCallback, useEffect, useMemo } from 'react';
import { DateRange } from 'react-day-picker';
import {
  areIntervalsOverlapping,
  isWithinInterval,
  max,
  min,
  startOfDay,
} from 'date-fns';

import * as U from '@utils';
import { Calendar } from '@components/shadcn/Calendar';
import usePersistentState from '@hooks/usePersistentState';
import usePortalSlugs from '@hooks/useSlugs';

import { Row, useDataTable, useFilterPopover } from './';

export interface DataTableFilterDateProps {
  /* Key for the "from" date in the row object. */
  dataKeyFrom: string;
  /* Key for the "to" date (optional, defaults to dataKeyFrom). */
  dataKeyTo: string;
  /* Unique key for registering the filter with <DataTable.Provider /> */
  filterKey: string;
  label: React.ReactNode;
}

export const FilterDate = ({
  dataKeyFrom,
  dataKeyTo,
  filterKey,
}: DataTableFilterDateProps) => {
  const { appSlug, pageSlug } = usePortalSlugs();
  const [dateRange, setDateRange] = usePersistentState<DateRange | undefined>(
    `${appSlug}-${pageSlug}-${filterKey}`,
  );

  // Connect to clear all filters and the clear from popover

  const { setActiveLabels } = useFilterPopover({
    onClear: () => setDateRange(undefined),
  });

  const { setFilterFn, rawData, filterFnMap } = useDataTable({
    onClearAllFilters: () => setDateRange(undefined),
  });

  // Create intervals used to disabled calendar days not in the dataset

  const intervalsFromDataSet = useMemo(() => {
    const filterFnMapOthers = U.omitKeys([filterKey], filterFnMap);

    return (
      rawData
        // Apply all other filters but our filter to get the relevant data set
        .filter((row: Row) =>
          Object.values(filterFnMapOthers).every((fn) => fn(row)),
        )
        // For those rows that have dates, create intervals
        .reduce<Array<{ start: Date; end: Date }>>((acc, row) => {
          if (row[dataKeyFrom]) {
            const start =
              row[dataKeyFrom] && startOfDay(new Date(row[dataKeyFrom]));

            const end = row[dataKeyTo]
              ? startOfDay(new Date(row[dataKeyTo]))
              : start;

            return [...acc, { start, end }];
          }

          return acc;
        }, [])
    );
  }, [rawData, filterFnMap, filterKey]);

  const minDate = useMemo(
    () => min(intervalsFromDataSet.map((interval) => interval.start)),
    [intervalsFromDataSet],
  );

  const maxDate = useMemo(
    () => max(intervalsFromDataSet.map((interval) => interval.end)),
    [intervalsFromDataSet],
  );

  // This is used by the <Calendar /> to know which days should be disabled
  const disabledMatchFn = useCallback(
    (day: Date) => {
      return intervalsFromDataSet.every((interval) => {
        return !isWithinInterval(day, interval);
      });
    },
    [intervalsFromDataSet],
  );

  const { from, to } = dateRange ?? {};

  useEffect(() => {
    if (!from) {
      setFilterFn(filterKey, false);
      setActiveLabels(filterKey, []);
    } else {
      const selectedFrom = startOfDay(from);
      const selectedTo = startOfDay(to ?? from);

      setFilterFn(filterKey, (row: any) => {
        const rowFrom = startOfDay(new Date(row[dataKeyFrom]));
        const rowTo = row[dataKeyTo] && startOfDay(new Date(row[dataKeyTo]));

        return areIntervalsOverlapping(
          { start: selectedFrom, end: selectedTo },
          { start: rowFrom, end: rowTo },
          { inclusive: true },
        );
      });

      setActiveLabels(filterKey, ['on']);
    }
  }, [
    from,
    to,
    filterKey,
    dataKeyFrom,
    dataKeyTo,
    minDate?.getTime(),
    maxDate?.getTime(),
  ]);

  return (
    <Calendar
      mode="range"
      disabled={disabledMatchFn}
      fromDate={minDate}
      toDate={maxDate}
      selected={dateRange}
      onSelect={setDateRange}
    />
  );
};
