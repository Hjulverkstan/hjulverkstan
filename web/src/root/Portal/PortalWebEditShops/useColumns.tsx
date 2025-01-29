import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { useMemo } from 'react';
import { Shop } from '@data/webedit/shop/types';
import { format } from 'date-fns';

export default function useColumns() {
  return useMemo(
    () =>
      [
        {
          key: 'name',
          name: 'Name',
          renderFn: ({ name }) => (
            <span className="text-primary font-medium">{name}</span>
          ),
        },
        {
          key: 'address',
          name: 'Address',
          renderFn: ({ address }) => (
            <span className="text-muted-foreground">{address}</span>
          ),
        },
        {
          key: 'openHours',
          name: 'Open Hours',
          renderFn: ({ openHours }) => (
            <div>
              {Object.entries(openHours || {}).map(([day, hours]) => (
                <div key={day}>
                  <span className="capitalize">{day}:</span>{' '}
                  <span className="text-muted-foreground">
                    {hours || 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'createdAt',
          name: 'Created At',
          renderFn: ({ createdAt }) =>
            createdAt ? (
              <IconLabel label={format(new Date(createdAt), 'yyyy-MM-dd')} />
            ) : (
              'N/A'
            ),
        },
        {
          key: 'updatedAt',
          name: 'Updated At',
          renderFn: ({ updatedAt }) =>
            updatedAt ? (
              <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
            ) : (
              'N/A'
            ),
        },
      ] as Array<DataTable.Column<Shop>>,
    [],
  );
}
