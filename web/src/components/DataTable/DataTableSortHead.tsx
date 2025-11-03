import { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { CaretSortIcon } from '@radix-ui/react-icons';

import { Button } from '@components/shadcn/Button';

import { useDataTable } from './';
import { cn } from '@utils/common';

interface SortHeadProps {
  colKey: string;
  children?: ReactNode;
  colName?: string;
  className?: string;
}

export function SortHead({
  className,
  children,
  colKey,
  colName,
}: SortHeadProps) {
  const T = useDataTable();

  const Icon =
    (T.sortState.key === colKey &&
      ((T.sortState.dir === 1 && ArrowDown) ||
        (T.sortState.dir === -1 && ArrowUp))) ||
    CaretSortIcon;

  return (
    <Button
      disabled={T.disabled}
      variant="ghost"
      className={cn(
        'data-[state=open]:bg-accent flex h-8 justify-start pl-3 pr-2',
        className,
      )}
      onClick={() => T.toggleColSort(colKey)}
    >
      {children ?? colName}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  );
}
