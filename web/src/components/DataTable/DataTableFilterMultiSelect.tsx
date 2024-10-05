import { useEffect, useMemo } from 'react';

import * as U from '@utils';
import { EnumAttributes } from '@data/enums';
import MultiSelect from '@components/MultiSelect';

import { Row, useDataTable, useFilterPopover } from './';

import usePersistentState from '@hooks/usePersistentState';
import usePortalSlugs from '@hooks/useSlugs';

export interface FilterMultiSelectProps {
  /* Used to register the built in filter function with DataTable */
  filterKey: string;
  /* A map of which enums should be used but under what dataKey they are
   * found on a row. This is then flattened but since this component is
   * responsible for connecting with data from DataTable it needs the dataKey.
   */
  enums: EnumAttributes[];
  heading?: string;
  initSelected?: string[];
}

export const FilterMultiSelect = ({
  filterKey,
  enums,
  heading,
  initSelected = [],
}: FilterMultiSelectProps) => {
  const { appSlug, pageSlug } = usePortalSlugs();
  const [selected, setSelected] = usePersistentState(
    `${appSlug}-${pageSlug}-${filterKey}-multiSelectFilter`,
    initSelected,
  );
  const { setActiveLabels } = useFilterPopover();

  const { filterFnMap, setFilterFn, rawData } = useDataTable({
    onClearAllFilters: () => setSelected([]),
  });

  // Add count to each enum and reject if not in the data of the table (rawData)

  const enumsAggregated = useMemo(() => {
    const { [filterKey]: _, ...filterFnMapOthers } = filterFnMap;

    const filterFnOtherFilters = (row: Row) =>
      Object.values(filterFnMapOthers).every((fn) => fn(row));

    const filteredData = rawData.filter(filterFnOtherFilters);

    return enums
      .map((e) => ({
        ...e,
        count: U.occurencesOfElInArray(
          e.value,
          filteredData
            .map((row) => row[e.dataKey])
            .flat()
            .filter((x) => x),
        ),
      }))
      .filter((e) =>
        rawData.some((row) =>
          Array.isArray(row[e.dataKey])
            ? row[e.dataKey].includes(e.value)
            : row[e.dataKey] === e.value,
        ),
      );
  }, [enums, rawData, filterFnMap]);

  const dataIsLoaded = !!rawData.length;

  // Connect with <PopoverFilterRoot /> and its activeFilters

  useEffect(() => {
    if (dataIsLoaded) {
      setActiveLabels(
        filterKey,
        selected.map((value) => enums.find((e) => e.value === value)!.label),
      );

      setFilterFn(
        filterKey,
        !!selected.length &&
          ((row) =>
            selected.some((value) => {
              const { dataKey } = enums.find((e) => e.value === value)!;

              return Array.isArray(row[dataKey])
                ? row[dataKey].includes(value)
                : row[dataKey] === value;
            })),
      );
    }
  }, [selected, dataIsLoaded, enums]);

  //

  return (
    <MultiSelect
      enums={enumsAggregated}
      selected={selected}
      setSelected={setSelected}
      heading={heading}
    />
  );
};

FilterMultiSelect.displayName = 'DataTableFilterMultiSelect';
