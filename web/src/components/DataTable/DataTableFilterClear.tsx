import { IconButton } from '@components/shadcn/Button';
import { useDataTable } from './';
import { Cross2Icon } from '@radix-ui/react-icons';

export const FilterClear = () => {
  const { isFiltered, clearAllFilters } = useDataTable();

  return (
    isFiltered && (
      <IconButton
        variant="ghost"
        onClick={clearAllFilters}
        text="Reset"
        className="h-8 px-2 lg:px-3"
        icon={Cross2Icon}
      />
    )
  );
};

FilterClear.displayName = 'DataTableFilterClear';
