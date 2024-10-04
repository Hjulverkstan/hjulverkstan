import { FC, useEffect, useMemo, useState } from 'react';

import { useDataTable } from '@components/DataTable/DataTableProvider';
import { useFilterPopover } from '@components/DataTable/DataTableFilterPopover';
import { Row } from '@hooks/useHeadlessTable';
import usePortalSlugs from '@hooks/useSlugs';
import usePersistentState from '@hooks/usePersistentState';
import { Slider } from '@components/shadcn/Slider';
import * as U from '@utils';

interface FilterSliderProps {
  dataKey: string;
  filterKey: string;
  heading?: string;
}

export const FilterSlider: FC<FilterSliderProps> = ({
  dataKey,
  filterKey,
  heading,
}) => {
  const { appSlug, pageSlug } = usePortalSlugs();
  const [range, setRange] = usePersistentState<[number, number] | []>(
    `${appSlug}-${pageSlug}-${filterKey}`,
    [],
  );

  const { setActiveLabels } = useFilterPopover({ onClear: () => setRange([]) });
  const { rawData, filterFnMap, setFilterFn } = useDataTable({
    onClearAllFilters: () => setRange([]),
  });

  const [prevMax, setPrevMax] = useState<number>();
  const [prevMin, setPrevMin] = useState<number>();

  /**
   * Apply all other filter function but this filter to get the available
   * slider steps
   */

  const steps = useMemo(() => {
    const filterFnMapOthers = U.omitKeys([filterKey], filterFnMap);

    const filteredByOtherFilters = rawData.filter((row: Row) =>
      Object.values(filterFnMapOthers).every((fn) => fn(row)),
    );

    return U.uniq(
      filteredByOtherFilters.map((row) => row[dataKey] as number).sort(),
    );
  }, [filterFnMap, rawData]);

  const min = steps[0];
  const max = steps[steps.length - 1];

  const rangeIndexes = [
    range.length ? steps.indexOf(range[0]) : 0,
    range.length ? steps.indexOf(range[1]) : steps.length - 1,
  ];

  const isActive =
    range.length && max && (range[0] !== min || range[1] !== max);

  useEffect(() => {
    if (range.length && max) {
      const newRange = [...range];
      if (prevMax && range[1] === prevMax) {
        newRange[1] = max;
      }
      if (prevMin && range[0] === prevMin) {
        newRange[0] = min;
      }
      if (newRange[0] !== range[0] || newRange[1] !== range[1]) {
        setRange(newRange as [number, number]);
      }
    } else if (!range.length && max) {
      setRange([min, max]);
    }
    setPrevMax(max);
    setPrevMin(min);
  }, [min, max, range]);

  useEffect(() => {
    if (!isActive) {
      setFilterFn(filterKey, false);
    } else {
      setFilterFn(filterKey, (row: any) => {
        const value = row[dataKey];
        return value >= range[0] && value <= range[1];
      });
    }
  }, [isActive, range, filterKey, setFilterFn]);

  useEffect(() => {
    setActiveLabels(filterKey, isActive ? [`${range[0]} - ${range[1]}`] : []);
  }, [filterKey, isActive, range, setActiveLabels]);

  return (
    <div className="w-full p-1">
      {heading && (
        <div
          className="h-7 w-48 p-1.5 px-2 text-xs font-medium leading-4
            text-gray-500"
        >
          {heading}
        </div>
      )}
      <div className="px-2 pb-3 pt-9">
        <Slider
          isActive={!!isActive}
          thumbs={2}
          disabled={!max}
          value={rangeIndexes}
          steps={steps}
          onValueChange={([l, r]) => setRange([steps[l], steps[r]])}
        />
      </div>
    </div>
  );
};
