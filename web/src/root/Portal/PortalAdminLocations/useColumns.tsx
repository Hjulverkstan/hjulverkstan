import { useMemo } from 'react';

import * as enums from '@data/location/enums';
import { Location } from '@data/location/types';

import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { format } from 'date-fns';

//

export default function useColumns() {
  return useMemo(
    () =>
      [
        {
          key: 'locationType',
          name: 'Type',
          renderFn: ({ locationType }) => (
            <IconLabel {...enums.find(locationType)} />
          ),
        },

        {
          key: 'name',
          name: 'Name',
          renderFn: ({ name }) => <IconLabel label={name} />,
        },

        {
          key: 'address',
          address: 'Address',
          renderFn: ({ address }) => <IconLabel label={address} />,
        },

        {
          key: 'vehicle-count',
          name: 'Vehicle count',
          renderFn: ({ vehicleIds }) => (
            <IconLabel label={vehicleIds.length.toString()} />
          ),
        },

        {
          key: 'comment',
          name: 'Comment',
          renderFn: (row) => (
            <span className="text-muted-foreground text-elipsis">
              {row.comment}
            </span>
          ),
        },

        {
          key: 'createdat',
          name: 'Created at',
          renderFn: ({ createdAt }) => (
            <IconLabel label={format(new Date(createdAt), 'yyyy-MM-dd')} />
          ),
        },

        {
          key: 'updatedat',
          name: 'Edited at',
          renderFn: ({ updatedAt }) => (
            <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
          ),
        },
      ] as Array<DataTable.Column<Location>>,
    [],
  );
}
