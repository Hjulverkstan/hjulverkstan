import React, { useEffect, useMemo, useState } from 'react';
import { Calendar } from '@components/shadcn/Calendar';
import { DateRange } from 'react-day-picker';
import { Row, useDataTable } from './';
import { max, min, parseISO, startOfDay } from 'date-fns';

/**
 * A date range filter for DataTable.
 *
 * @param {string} dataKeyFrom - Key for the "from" date in the row object.
 * @param {string} dataKeyTo - Key for the "to" date (optional, defaults to dataKeyFrom).
 * @param {string} filterKey - Unique key for registering the filter.
 * @param {React.ReactNode} label - To show calendar icon instead of text.
 *
 * This component uses `useDataTable` to apply a date range filter. It resets the time to midnight
 * in order to filter correctly. The filter is cleared when no dates are selected. It subscribes to
 * "clear all filters" events to reset the date range.
 */

export interface DataTableFilterDateProps {
  dataKeyFrom: string;
  dataKeyTo: string;
  filterKey: string;
  label: React.ReactNode;
}

export const FilterDate = ({
  dataKeyFrom,
  dataKeyTo,
  filterKey,
}: DataTableFilterDateProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const { setFilterFn, rawData, filterFnMap } = useDataTable({
    onClearAllFilters: () => setDateRange(undefined),
  });

  /**
   *  Extract the min and max date of the data table data, with all other
   *  filters applied, excluding this filter. We do this by manually applying
   *  all the other filters filterFns.
   */

  const { minDate, maxDate } = useMemo(() => {
    const { [filterKey]: _, ...filterFnMapOthers } = filterFnMap;

    const filteredByOtherFilters = rawData.filter((row: Row) =>
      Object.values(filterFnMapOthers).every((fn) => fn(row)),
    );

    return {
      minDate: min(
        filteredByOtherFilters.map((el) => parseISO(el[dataKeyFrom])),
      ),
      maxDate: max(
        filteredByOtherFilters.map((el) =>
          parseISO(el[dataKeyTo] || el[dataKeyFrom]),
        ),
      ),
    };
  }, [rawData, filterFnMap]);

  useEffect(() => {
    if (!dateRange) {
      setFilterFn(filterKey, false);
    } else {
      const selectedTo = startOfDay(dateRange.to ? dateRange.to : maxDate);
      const selectedFrom = startOfDay(
        dateRange.from ? dateRange.from : minDate,
      );

      setFilterFn(filterKey, (row: any) => {
        const fromDate = startOfDay(new Date(row[dataKeyFrom]));
        const toDate = startOfDay(new Date(row[dataKeyTo] || row[dataKeyFrom]));

        return fromDate >= selectedFrom && toDate <= selectedTo;
      });
    }
  }, [dateRange, filterKey, dataKeyFrom, dataKeyTo, minDate, maxDate]);

  return (
    <Calendar
      mode="range"
      fromDate={minDate}
      toDate={maxDate}
      selected={dateRange}
      onSelect={setDateRange}
    />
  );
};

FilterDate.displayName = 'DataTableFilterDate';
