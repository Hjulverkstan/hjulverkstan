import { IconButton } from '@components/shadcn/Button';
import { useDataTable } from './';
import { Cross2Icon } from '@radix-ui/react-icons';

export const FilterClear = () => {
  const { isFiltered, clearAllFilters } = useDataTable();

  return (
    isFiltered && (
      <IconButton
        variant="accent"
        subVariant="flat"
        onClick={clearAllFilters}
        icon={Cross2Icon}
        tooltip="Clear filters"
      />
    )
  );
};

FilterClear.displayName = 'DataTableFilterClear';
