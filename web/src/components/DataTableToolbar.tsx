import { useMemo, useState, useEffect, ReactNode } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';

import * as U from '@utils';
import FacetedFilterDropdown, {
  FilterOption,
} from '@components/FacetedFilterDropdown';

import { useDataTable } from './DataTable';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { Row } from '@hooks/useHeadlessTable';

//

export interface DropdownFilterProps {
  /* Column key used for getting the values from data[] */
  colKey: string;
  label: string;
  options: FilterOption[];
}

export const DropdownFilter = ({
  colKey,
  label,
  options,
}: DropdownFilterProps) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { setFilterFn, isFiltered, filteredData, rawData } = useDataTable();

  const injectedOptions = useMemo(() => {
    const filteredValues = filteredData.map((row) => row[colKey]);
    const totalValues = rawData.map((row) => row[colKey]);

    // ['bike', 'bike', 'skate'] => { bike: 2, skate: 1 }
    const valueCountMap = U.toArrayValueCountMap(filteredValues as string[]);

    console.log(options, totalValues, colKey, rawData);

    return (
      options
        // remove options that are not at all in the data
        .filter((option) => totalValues.includes(option.value))
        // add data needed for FacetedFilterDropdown
        .map((option) => ({ ...option, count: valueCountMap[option.value] }))
    );
  }, [rawData, filteredData, colKey, options]);

  useEffect(() => {
    if (!isFiltered) setSelected([]); // Clear on reset
  }, [isFiltered]);

  return (
    <FacetedFilterDropdown
      label={label}
      options={injectedOptions}
      selected={selected}
      setSelected={(value) => {
        setSelected(value);
        setFilterFn(
          colKey,
          !!value.length &&
            ((row: Row) => value.includes(row[colKey] as string)),
        );
      }}
    />
  );
};

//

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
              Object.values(row).some(
                (val) =>
                  typeof val === 'string' &&
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
