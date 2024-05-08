import { useMemo } from 'react';

import { Employee } from '@data/employee/types';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';

//

export default function useColumns() {
  return useMemo(
    () =>
      [
        {
          key: 'name',
          name: 'Name',
          renderFn: ({ firstName, lastName }) => (
            <IconLabel label={`${firstName} ${lastName}`} />
          ),
        },

        {
          key: 'persidnr',
          name: 'Pers. Identity No.',
          renderFn: ({ personalIdentityNumber }) => (
            <IconLabel label={personalIdentityNumber} />
          ),
        },

        {
          key: 'phonenr',
          name: 'Phone No.',
          renderFn: ({ phoneNumber }) => <IconLabel label={phoneNumber} />,
        },

        {
          key: 'email',
          name: 'Email',
          renderFn: ({ email }) => <IconLabel label={email} />,
        },

        {
          key: 'no',
          name: 'Empl. No.',
          renderFn: ({ employeeNumber }) => (
            <IconLabel label={employeeNumber} />
          ),
        },
      ] as Array<DataTable.Column<Employee>>,
    [],
  );
}
