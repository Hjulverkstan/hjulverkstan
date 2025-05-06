import { useMemo } from 'react';
import { format } from 'date-fns';
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
          key: 'imageURL',
          name: 'Image',
          renderFn: ({ imageURL }: { imageURL: any }) => (
            <span>{imageURL}</span>
          ),
        },
        {
          key: 'updatedat',
          name: 'Edited at',
          renderFn: ({ updatedAt }) => (
            <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
          ),
        },
      ] as DataTable.Column<GeneralContent>[],
    [],
  );
}
