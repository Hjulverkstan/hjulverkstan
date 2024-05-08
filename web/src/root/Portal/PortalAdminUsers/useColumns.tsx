import { useMemo } from 'react';

import { User } from '@data/user/types';
import * as enums from '@data/user/enums';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import BadgeGroup from '@components/BadgeGroup';

//

export default function useColumns() {
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
      ] as Array<DataTable.Column<User>>,
    [],
  );
}
