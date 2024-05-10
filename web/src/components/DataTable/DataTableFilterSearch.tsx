import { useState, useEffect } from 'react';

import * as U from '@utils';
import { Input } from '@components/shadcn/Input';

import { Row, useDataTable } from './';
import { buttonVariants } from '@components/shadcn/Button';

//

export type SearchMatchFn = (word: string, row: any) => boolean;

export const fuzzyMatchFn = (keys: string[], word: string, row: Row) =>
  keys.some((key) => row[key]?.toLowerCase().includes(word));

//

export interface FilterSearchProps {
  placeholder: string;
  matchFn: SearchMatchFn;
}

export const FilterSearch = ({ placeholder, matchFn }: FilterSearchProps) => {
  const [value, setValue] = useState('');
  const { disabled, setFilterFn, isFiltered } = useDataTable();

  useEffect(() => {
    if (!isFiltered) setValue(''); // Clear on reset
  }, [isFiltered]);

  return (
    <Input
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={({ target: { value } }) => {
        const filterFn = (row: Row) =>
          value?.split(' ').every((word) => matchFn(word.toLowerCase(), row));

        setValue(value);
        setFilterFn('ANY', !!value && filterFn);
      }}
      data-state={!!value && 'active'}
      className={U.cn(
        buttonVariants({ variant: 'accent', subVariant: 'flat' }),
        'h-8 w-[150px] font-normal data-[state=active]:font-medium lg:w-[250px]',
      )}
    />
  );
};

FilterSearch.displayName = 'DataTableFilterSearch';
