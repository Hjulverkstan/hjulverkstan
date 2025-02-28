import { useMemo } from 'react';
import { format, isValid } from 'date-fns';
import { GeneralContent } from '@data/webedit/general/types';
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
          key: 'imageUrl',
          name: 'Image',
          renderFn: ({ imageUrl }: { imageUrl: any }) => (
            <span>{imageUrl}</span>
          ),
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
      ] as DataTable.Column<GeneralContent>[],
    [],
  );
}
