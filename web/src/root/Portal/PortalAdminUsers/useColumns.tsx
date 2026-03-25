import { useMemo } from 'react';

import { User } from '@data/user/types';
import * as enumsRaw from '@data/user/enums';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import BadgeGroup from '@components/BadgeGroup';
import { format } from 'date-fns';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { useLocationsAsEnumsQ } from '@data/location/queries';

//

export default function useColumns() {
  const enums = useTranslateRawEnums(enumsRaw);
  const { data: locationEnums = [] } = useLocationsAsEnumsQ();
  return useMemo(
    () =>
      [
        {
          key: 'username',
          name: 'Username',
          renderFn: ({ username }) => <IconLabel label={username} />,
        },

        {
          key: 'email',
          name: 'Email',
          renderFn: ({ email }) => <IconLabel label={email} />,
        },

        {
          key: 'roles',
          name: 'Roles',
          renderFn: ({ roles }) => (
            <BadgeGroup
              badges={enums.roles
                .filter((e) => roles.includes(e.value))
                .map((badge) => ({ ...badge, variant: 'outline' }))}
            />
          ),
        },

        {
          key: 'locationId',
          name: 'Location',
          renderFn: ({ locationId }) => {
            const location = locationEnums.find(
              (e) => String(e.value) === String(locationId),
            );
            return <IconLabel label={location?.label || ''} />;
          },
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
          renderFn: ({ updatedAt }) =>
            updatedAt && (
              <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
            ),
        },
      ] as Array<DataTable.Column<User>>,
    [enums, locationEnums],
  );
}
