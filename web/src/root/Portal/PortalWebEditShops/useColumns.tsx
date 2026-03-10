import { useMemo } from 'react';

import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { Shop } from '@data/webedit/shop/types';

//

export default function useColumns() {
  return useMemo(
    () =>
      [
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
          key: 'latitude',
          name: 'Latitude',
          renderFn: ({ latitude }) => <IconLabel label={latitude} />,
        },
        {
          key: 'longitude',
          name: 'Longitude',
          renderFn: ({ longitude }) => <IconLabel label={longitude} />,
        },
      ] as Array<DataTable.Column<Shop>>,
    [],
  );
}
