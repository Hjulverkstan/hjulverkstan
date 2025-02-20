import { useMemo } from 'react';
import { format, isValid } from 'date-fns';
import { GeneralContent } from '@data/webedit/general/types';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';

export default function useColumns() {
  return useMemo(
    () =>
      [
        // {
        //   key: 'textType',
        //   name: 'Type',
        //   renderFn: ({ textType }: { textType: string }) => (
        //     <span>{textType}</span>
        //   ),
        // },
        {
          key: 'name',
          name: 'Name',
          renderFn: ({ name }: { name: string }) => <span>{name}</span>,
        },
        // {
        //   key: 'description',
        //   name: 'Description',
        //   renderFn: ({ description }: { description: string }) => (
        //     <span>{description}</span>
        //   ),
        // },
        // {
        //   key: 'key',
        //   name: 'Key',
        //   renderFn: ({ key }: { key: string }) => <span>{key}</span>,
        // },
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
      ] as DataTable.Column<GeneralContent>[],
    [],
  );
}
