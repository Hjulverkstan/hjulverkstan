import { ArrowDown, ArrowUp } from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { Button } from '@components/shadcn/Button';

import { useDataTable, Column } from './';

interface SortHeadProps {
  col: Column<any>;
}

export function SortHead({ col }: SortHeadProps) {
  const T = useDataTable();

  const Icon =
    (T.sortState.key === col.key &&
      ((T.sortState.dir === 1 && ArrowDown) ||
        (T.sortState.dir === -1 && ArrowUp))) ||
    CaretSortIcon;

  return (
    <Button
      disabled={T.disabled}
      variant="ghost"
      className="data-[state=open]:bg-accent flex h-8 justify-start pl-3 pr-2"
      onClick={() => T.toggleColSort(col.key)}
    >
      {col.name}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}
