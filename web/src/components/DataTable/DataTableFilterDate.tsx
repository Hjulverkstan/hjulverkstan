import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import {
  areIntervalsOverlapping,
  format,
  getMonth,
  isWithinInterval,
  max,
  min,
  startOfDay,
} from 'date-fns';

import * as C from '@utils/common';
import { Calendar } from '@components/shadcn/Calendar';
import usePersistentState from '@hooks/usePersistentState';
import usePortalSlugs from '@hooks/useSlugs';

import { Row, useDataTable, useFilterPopover } from './';

export interface DataTableFilterDateProps {
  disabled?: boolean;
  /* Key for the "from" date in the row object. */
  dataKeyFrom?: string;
  /* Key for the "to" date (optional, defaults to dataKeyFrom). */
  dataKeyTo?: string;
  /* Unique key for registering the filter with <DataTable.Provider /> */
  filterKey: string;
  /* Override the persisted state and set to no selected dateRange */
  shouldClearPersistedState?: boolean;
  /*
   * Because we want to subscribe to popover filter on clear outside the popover
   * context in the case of <PortalFilterDate />
   */
  onClear?: () => void;
}

export const FilterDate = ({
  disabled,
  dataKeyFrom,
  dataKeyTo,
  filterKey,
  shouldClearPersistedState,
  onClear,
}: DataTableFilterDateProps) => {
  const { appSlug, pageSlug } = usePortalSlugs();
  const [dateRange, setDateRange] = usePersistentState<DateRange | undefined>(
    `${appSlug}-${pageSlug}-${filterKey}-filterDate`,
    (fromStore) => (shouldClearPersistedState ? undefined : fromStore),
  );

  const [month, setMonth] = useState(new Date());

  // Used by <PortalFilterDate /> to be cleared if this filter is loaded with no
  // selected date range

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
    if (!isInitialized && !dateRange && onClear) onClear();
  }, [isInitialized, dateRange, onClear]);

  // Connect to clear all filters and the clear from popover

  const { setActiveLabels } = useFilterPopover({
    onClear: () => {
      setDateRange(undefined);
      if (onClear) onClear();
    },
  });

  const { setFilterFn, rawData, filterFnMap } = useDataTable({
    onClearAllFilters: () => setDateRange(undefined),
  });

  // Create intervals used to disabled calendar days not in the dataset

  const intervalsFromDataSet = useMemo(() => {
    const filterFnMapOthers = C.omitKeys([filterKey], filterFnMap);

    return !dataKeyFrom || !dataKeyTo
      ? undefined
      : rawData
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
          }, []);
  }, [rawData, filterFnMap, filterKey, dataKeyFrom, dataKeyTo]);

  const minDate = useMemo(
    () =>
      intervalsFromDataSet &&
      min(intervalsFromDataSet.map((interval) => interval.start)),
    [intervalsFromDataSet],
  );

  const maxDate = useMemo(
    () =>
      intervalsFromDataSet &&
      max(intervalsFromDataSet.map((interval) => interval.end)),
    [intervalsFromDataSet],
  );

  // This is used by the <Calendar /> to know which days should be disabled

  const disabledMatchFn = useCallback(
    (day: Date) =>
      !!intervalsFromDataSet?.every(
        (interval) => !isWithinInterval(day, interval),
      ),
    [intervalsFromDataSet],
  );

  // Clear selection if outside accepted date range from the data set.

  useEffect(() => {
    if (
      intervalsFromDataSet?.length &&
      ((dateRange?.from && disabledMatchFn(dateRange.from)) ||
        (dateRange?.to && disabledMatchFn(dateRange.to)))
    ) {
      setDateRange(undefined);
    }
  }, [intervalsFromDataSet, minDate, maxDate, dateRange]);

  // Clamp the selected month to the accepted date range from the data set.

  useEffect(() => {
    setMonth((prevMonth) => {
      if (maxDate && getMonth(prevMonth) > getMonth(maxDate)) return maxDate;
      if (minDate && getMonth(prevMonth) < getMonth(minDate)) return minDate;
      return prevMonth;
    });
  }, [minDate, maxDate]);

  // Propagate popover label and data table filter function

  const { from, to } = dateRange ?? {};

  useEffect(() => {
    if (!from || !dataKeyFrom || !dataKeyTo) {
      setFilterFn(filterKey, false);
      setActiveLabels(filterKey, []);
    } else {
      const selectedFrom = startOfDay(from);
      const selectedTo = to ? startOfDay(to) : selectedFrom;

      setFilterFn(filterKey, (row: any) => {
        const rowFrom = startOfDay(new Date(row[dataKeyFrom]));
        const rowTo = row[dataKeyTo]
          ? startOfDay(new Date(row[dataKeyTo]))
          : rowFrom;

        return areIntervalsOverlapping(
          { start: selectedFrom, end: selectedTo },
          { start: rowFrom, end: rowTo },
          { inclusive: true },
        );
      });

      const label = to
        ? `${format(selectedFrom, 'yyyy-MM-dd')} - ${format(selectedTo, 'yyyy-MM-dd')}`
        : `${format(selectedFrom, 'yyyy-MM-dd')}`;

      setActiveLabels(filterKey, [label]);
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
      month={month}
      onMonthChange={setMonth}
      disableNavigation={!!disabled}
      disabled={disabled ? () => true : disabledMatchFn}
      fromDate={minDate}
      toDate={maxDate}
      selected={dateRange}
      onSelect={setDateRange}
    />
  );
};
