import * as DataTable from '@components/DataTable';
import { useMemo } from 'react';
import { Shop } from '@data/webedit/shop/types';
import IconLabel from '@components/IconLabel';
import { format, isValid } from 'date-fns';

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
          key: 'description',
          name: 'Description',
          renderFn: ({ bodyText }) => (
            <span className="text-muted-foreground">{bodyText}</span>
          ),
        },
        {
          key: 'imageUrl',
          name: 'Image',
          renderFn: ({ imageUrl }: { imageUrl: any }) => (
            <span>{imageUrl}</span>
          ),
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
      ] as Array<DataTable.Column<Shop>>,
    [],
  );
}
