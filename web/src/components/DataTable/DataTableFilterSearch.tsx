import { useEffect, useRef } from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';

import * as C from '@utils/common';
import { Input } from '@components/shadcn/Input';

import { buttonVariants } from '@components/shadcn/Button';
import {
  Content as PopoverContent,
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
} from '@components/shadcn/Popover';

import { Row, useDataTable } from './';
import usePersistentState from '@hooks/usePersistentState';
import usePortalSlugs from '@hooks/useSlugs';
import { useFocusOnKeyPress } from '@hooks/useFocusOnKeyPress'; // <-- add

export type SearchMatchFn = (word: string, row: any) => boolean;

export const fuzzyMatchFn = (keys: string[], word: string, row: Row) =>
  keys.some((key) => row[key]?.toLowerCase().includes(word));

//

export interface FilterSearchProps {
  placeholder: string;
  matchFn: SearchMatchFn;
  toInitSelected?: (fromStore?: string) => string | undefined;
}

export const FilterSearch = ({
  placeholder,
  matchFn,
  toInitSelected,
}: FilterSearchProps) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const { appSlug, pageSlug } = usePortalSlugs();
  const [value, setValue] = usePersistentState<string>(
    `${appSlug}-${pageSlug}-searchFilter`,
    (fromStore) =>
      (toInitSelected ? toInitSelected(fromStore) : fromStore) ?? '',
  );

  const { disabled, setFilterFn } = useDataTable({
    onClearAllFilters: () => setValue(''),
  });

  // Ensures that the search result is saved based on the search text input.
  useEffect(() => {
    const filterFn = (row: Row) =>
      value
        ?.split(' ')
        .every((word: string) => matchFn(word.toLowerCase(), row));

    setFilterFn('ANY', !!value && filterFn);
  }, [value, matchFn, setFilterFn]);

  useFocusOnKeyPress(ref, '/');

  return (
    <div className="relative flex items-center">
      <div>
        <Input
          ref={ref}
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          data-state={!!value && 'active'}
          className={C.cn(
            buttonVariants({ variant: 'accent', subVariant: 'flat' }),
            `h-8 w-[150px] font-normal data-[state=active]:font-medium
lg:w-[250px]`,
          )}
        />
        <PopoverRoot>
          <PopoverTrigger asChild>
            <span
              className="hover:bg-muted text-muted-foreground
hover:text-accent-foreground absolute right-2 top-1/2 z-10 flex h-6 w-6
-translate-y-1/2 transform cursor-pointer items-center justify-center rounded-sm
text-sm text-black"
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