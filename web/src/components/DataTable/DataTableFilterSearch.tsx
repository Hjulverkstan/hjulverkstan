import { useState } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';

import * as U from '@utils';
import { Input } from '@components/shadcn/Input';

import { buttonVariants } from '@components/shadcn/Button';
import {
  Content as PopoverContent,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from '@components/shadcn/Popover';

import { Row, useDataTable } from './';

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

  const { disabled, setFilterFn } = useDataTable({
    onClearAllFilters: () => setValue(''),
  });

  return (
    <div className="relative flex items-center">
      <div>
        <Input
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={({ target: { value } }) => {
            const filterFn = (row: Row) =>
              value
                ?.split(' ')
                .every((word) => matchFn(word.toLowerCase(), row));

            setValue(value);
            setFilterFn('ANY', !!value && filterFn);
          }}
          data-state={!!value && 'active'}
          className={U.cn(
            buttonVariants({ variant: 'accent', subVariant: 'flat' }),
            `h-8 w-[150px] font-normal data-[state=active]:font-medium
            lg:w-[250px]`,
          )}
        />
        <PopoverRoot>
          <PopoverTrigger asChild>
            <span
              className="hover:bg-muted text-muted-foreground
                hover:text-accent-foreground absolute right-2 top-1/2 z-10 flex
                h-6 w-6 -translate-y-1/2 transform cursor-pointer items-center
                justify-center rounded-sm text-sm text-black"
            >
              <InfoCircledIcon className="h-4 w-4" />
            </span>
          </PopoverTrigger>
          <PopoverContent
            className="bg-muted text-accent-foreground"
            sideOffset={12}
          >
            <p className="text-sm">
              Search across all columns, combine multiple keywords to refine
              your query.
            </p>
          </PopoverContent>
        </PopoverRoot>
      </div>
    </div>
  );
};

FilterSearch.displayName = 'DataTableFilterSearch';
