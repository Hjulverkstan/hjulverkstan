import { FC, useEffect, useMemo, useState } from 'react';

import { useDataTable } from '@components/DataTable/DataTableProvider';
import { useFilterPopover } from '@components/DataTable/DataTableFilterPopover';
import { Row } from '@hooks/useHeadlessTable';
import usePortalSlugs from '@hooks/useSlugs';
import usePersistentState from '@hooks/usePersistentState';
import { Slider } from '@components/shadcn/Slider';
import * as C from '@utils/common';
import { Button } from '@components/shadcn/Button';
import { Cross2Icon } from '@radix-ui/react-icons';

interface FilterSliderProps {
  dataKey: string;
  filterKey: string;
  heading?: string;
}

type Range = [number, number];

export const FilterSlider: FC<FilterSliderProps> = ({
  dataKey,
  filterKey,
  heading,
}) => {
  /**
   * Setup states and context connections
   */

  const [isInitialized, setIsInitialized] = useState(false);

  const { appSlug, pageSlug } = usePortalSlugs();
  const [range, setRange] = usePersistentState<Range | undefined>(
    `${appSlug}-${pageSlug}-${filterKey}`,
  );

  const { setActiveLabels } = useFilterPopover({
    onClear: () => setRange(undefined),
  });

  const { rawData, filterFnMap, setFilterFn } = useDataTable({
    onClearAllFilters: () => setRange(undefined),
  });

  /**
   * Derive needed data from state, context connections and props
   */

  // Data set filtered by all other active filters but our filter
  const filteredDataByOthers = useMemo(() => {
    const filterFnMapOthers = C.omitKeys([filterKey], filterFnMap);

    return rawData.filter((row: Row) =>
      Object.values(filterFnMapOthers).every((fn) => fn(row)),
    );
  }, [filterKey, filterFnMap, rawData]);

  // Steps from the filtered data
  const filteredSteps = useMemo(
    () =>
      C.uniq(filteredDataByOthers.map((row) => row[dataKey] as number)).sort(),
    [filteredDataByOthers, range, dataKey],
  );

  // These steps are allowed to select
  const allowedSteps = useMemo(
    () => C.uniq(filteredSteps.concat(range ?? [])).sort(),
    [filteredSteps, range],
  );

  const min = allowedSteps[0];
  const max = allowedSteps[allowedSteps.length - 1];

  // The full range of steps for the slider
  const allSteps = useMemo(
    () => C.uniq(rawData.map((row) => row[dataKey] as number)).sort(),
    [rawData, dataKey],
  );

  const allMin = allSteps[0];
  const allMax = allSteps[allSteps.length - 1];

  /**
   * Create the needed side effects
   */

  // If range from persisted state make sure is allowed
  useEffect(() => {
    const isNotOfDataSet = !!range && range.some((v) => !allSteps.includes(v));
    const isFullRange = C.shallowEq([min, max], range);

    if (range && !isInitialized && (isNotOfDataSet || isFullRange)) {
      setRange(undefined);
    }

    setIsInitialized(true);
  }, [range, allowedSteps, min, max, isInitialized]);

  // Connect to data table filtering and the popover filter labels
  useEffect(() => {
    if (range) {
      setFilterFn(
        filterKey,
        (row: any) => row[dataKey] >= range[0] && row[dataKey] <= range[1],
      );
      setActiveLabels(filterKey, [
        range[0] === range[1] ? `${range[0]}` : `${range[0]} - ${range[1]}`,
      ]);
    } else {
      setActiveLabels(filterKey, []);
      setFilterFn(filterKey, false);
    }
  }, [range, filterKey, setFilterFn]);

  /**
   * Handle input and output for the <Slider>
   */

  // If no selected range, the thumbs should still be visible as min and max
  const value = (isInitialized && range) || (allowedSteps && [min, max]) || [];

  // Remove selected range if is full again and don't allow the thumbs to be out
  // of the filtered data set as this would to filtering with no results
  const onValueChange = (nextRange: Range) => {
    const isCompleteRange = C.shallowEq([allMin, allMax], nextRange);
    const inFilteredRange = filteredSteps.some(
      (v) => v >= nextRange[0] && v <= nextRange[1],
    );

    if (isCompleteRange) setRange(undefined);
    else if (inFilteredRange) setRange(nextRange);
  };

  return (
    <div className="w-full p-1">
      {heading && (
        <div className="flex justify-between">
          <div
            className="h-7 w-48 p-1.5 px-2 text-xs font-medium leading-4
text-gray-500"
          >
            {heading}
          </div>
          {!!range && (
            <Button
              variant="ghost"
              className="mx-1 my-0.5 h-6 w-6 p-0"
              tooltip="Clear slider"
              onClick={() => setRange(undefined)}
            >
              <Cross2Icon className="text-muted-foreground h-4 w-4" />
            </Button>
          )}
        </div>
      )}
      <div className="px-2 pb-3 pt-9">
        <Slider
          isActive={!!range}
          thumbs={2}
          disabled={!max}
          steps={allSteps}
          minThumbValue={min}
          maxThumbValue={max}
          onValueChange={onValueChange}
          value={value}
        />
      </div>
    </div>
  );
};
