import { useMemo } from 'react';

import * as enumsRaw from '@data/location/enums';
import { Location } from '@data/location/types';

import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { format } from 'date-fns';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum } from '@utils/enums';

//

export default function useColumns() {
  const enums = useTranslateRawEnums(enumsRaw);

  return useMemo(
    () =>
      [
        {
          key: 'locationType',
          name: 'Type',
          renderFn: ({ locationType }) => (
            <IconLabel {...findEnum(enums, locationType)} />
          ),
        },

        {
          key: 'name',
          name: 'Name',
          renderFn: ({ name }) => <IconLabel label={name} />,
        },

        {
          key: 'address',
          name: 'Address',
          renderFn: ({ address }) => <IconLabel label={address} />,
        },

        {
          key: 'vehicleCount',
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
          key: 'createdAt',
          name: 'Created at',
          renderFn: ({ createdAt }) => (
            <IconLabel label={format(new Date(createdAt), 'yyyy-MM-dd')} />
          ),
        },

        {
          key: 'updatedAt',
          name: 'Edited at',
          renderFn: ({ updatedAt }) => (
            <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
          ),
        },
      ] as Array<DataTable.Column<Location>>,
    [],
  );
}
