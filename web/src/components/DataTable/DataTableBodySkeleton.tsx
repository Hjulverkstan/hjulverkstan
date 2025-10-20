import * as C from '@utils/common';
import * as Table from '@components/shadcn/Table';
import { Skeleton } from '@components/shadcn/Skeleton';

import { Column, useDataTable } from './';

export interface BodySkeletonProps {
  columns: Array<Column<any>>;
}

export const BodySkeleton = ({ columns }: BodySkeletonProps) => {
  const { hiddenCols } = useDataTable();

  const visibleColumns = columns.filter(({ key }) => !hiddenCols.includes(key));

  return (
    <Table.Body>
      {Array(6)
        .fill(0)
        .map((_, y) => (
          <Table.Row key={y} className="pl-4">
            {visibleColumns.map(({ key }, x) => (
              <Table.Cell key={key} className={C.cn(x === 0 && 'pl-4')}>
                <Skeleton className="my-1 h-4 w-[100px]" />
              </Table.Cell>
            ))}
            <Table.Cell className="z20 sticky right-0 w-10"></Table.Cell>
          </Table.Row>
        ))}
    </Table.Body>
  );
};

BodySkeleton.displayName = 'DataTableBodySkeleton';
