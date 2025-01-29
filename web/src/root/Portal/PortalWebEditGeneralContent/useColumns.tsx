import { useMemo } from 'react';
import { format, isValid } from 'date-fns';
import { GeneralContentStripped } from '@data/webedit/general/types';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';

export default function useColumns() {
  return useMemo(
    () =>
      [
        {
          key: 'name',
          name: 'Name',
          renderFn: ({ name }: { name: string }) => <span>{name}</span>,
        },
        {
          key: 'value',
          name: 'Value',
          renderFn: ({ value }: { value: any }) => <span>{value}</span>,
        },
        {
          key: 'createdAt',
          name: 'Created at',
          renderFn: ({ createdAt }: { createdAt: string }) => {
            const date = new Date(createdAt);
            return (
              <IconLabel
                label={isValid(date) ? format(date, 'yyyy-MM-dd') : '-'}
              />
            );
          },
        },
        {
          key: 'updatedAt',
          name: 'Edited at',
          renderFn: ({ updatedAt }: { updatedAt: string }) => {
            const date = new Date(updatedAt);
            return (
              <IconLabel
                label={isValid(date) ? format(date, 'yyyy-MM-dd') : '-'}
              />
            );
          },
        },
      ] as DataTable.Column<GeneralContentStripped>[],
    [],
  );
}
