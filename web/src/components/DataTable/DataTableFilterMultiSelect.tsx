import { useEffect, useState, useMemo } from 'react';

import * as U from '@utils';
import { RowEnumAttrMap, EnumAttributes } from '@data/enums';
import MultiSelect from '@components/MultiSelect';

import { Row, useDataTable, useFilterPopover } from './';

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
  const { setActiveLabels } = useFilterPopover();
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
    <MultiSelect
      enums={flatEnumsAggregated}
      selected={selected}
      setSelected={setSelected}
      heading={heading}
    />
  );
};

FilterMultiSelect.displayName = 'DataTableFilterMultiSelect';
