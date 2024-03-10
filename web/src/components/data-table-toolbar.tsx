import { useMemo, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ColorWheelIcon, Cross2Icon } from '@radix-ui/react-icons';
import { BabyIcon } from 'lucide-react';

import * as U from '@utils';
import FacetedFilterDropdown from '@components/faceted-filter-dropdown';

import type { Vehicle } from '../root/admin/inventory';
import { useDataTable } from './data-table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import type { Row } from '@hooks/useHeadlessTable';

//

type Option = {
  value: string;
  name: string;
} & Record<string, any>;

const useFilterOptions = (colKey: string, baseOptions: Option[]) => {
  const { filteredData, rawData } = useDataTable();

  return useMemo(() => {
    const filteredValues = filteredData.map((row) => row[colKey]);
    const totalValues = rawData.map((row) => row[colKey]);

    const valueCountMap = U.toArrayValueCountMap(filteredValues as string[]);

    return (
      baseOptions
        // remove options that are not at all in the data
        .filter((option) => totalValues.includes(option.value))
        // add data needed for FacetedFilterDropdown
        .map((option) => ({ ...option, count: valueCountMap[option.value] }))
    );
  }, [rawData, filteredData, colKey, baseOptions]);
};

//

export const vehicleTypeOptions = [
  { value: 'bike', name: 'Bike', icon: ColorWheelIcon },
  { value: 'stroller', name: 'Stroller', icon: BabyIcon },
];

export const VehicleType = () => {
  const options = useFilterOptions('type', vehicleTypeOptions);
  const { setFilterFn, isFiltered } = useDataTable<Vehicle>();

  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (!isFiltered) setSelected([]); // Clear on reset
  }, [isFiltered]);

  return (
    <FacetedFilterDropdown
      label="Type"
      options={options}
      selected={selected}
      setSelected={(value) => {
        setSelected(value);
        setFilterFn(
          'type',
          !!value.length && ((row: Vehicle) => value.includes(row.type)),
        );
      }}
    />
  );
};

export const Search = ({ placeholder }: { placeholder: string }) => {
  const [value, setValue] = useState('');
  const { setFilterFn, isFiltered } = useDataTable();

  useEffect(() => {
    if (!isFiltered) setValue(''); // Clear on reset
  }, [isFiltered]);

  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={({ target: { value } }) => {
        const filterFn = (row: Row) =>
          value
            .split(' ')
            .every((word) =>
              Object.values(row).some((val) =>
                val.toLowerCase().includes(word.toLowerCase()),
              ),
            );

        setValue(value);
        setFilterFn('ANY', !!value && filterFn);
      }}
      className="h-8 w-[150px] lg:w-[250px]"
    />
  );
};

//

interface WrapperProps {
  children: ReactNode;
}

export const WrapperLeft = ({ children }: WrapperProps) => {
  const { isFiltered, clearAllFilters } = useDataTable();

  return (
    <div className="flex flex-1 items-center space-x-2">
      {children}
      {isFiltered && (
        <Button
          variant="ghost"
          onClick={clearAllFilters}
          className="h-8 px-2 lg:px-3"
        >
          Reset
          <Cross2Icon className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export const WrapperRight = ({ children }: WrapperProps) => (
  <div className="flex flex-1 items-center justify-end space-x-2">
    {children}
  </div>
);
