import { useMemo } from 'react';

import { Employee } from '@data/employee/types';
import * as DataTable from '@components/DataTable';
import IconLabel from '@components/IconLabel';
import { format } from 'date-fns';

//

export default function useColumns() {
  return useMemo(
    () =>
      [
        {
          key: 'firstName',
          name: 'Name',
          renderFn: ({ firstName, lastName }) => (
            <IconLabel label={`${firstName} ${lastName}`} />
          ),
        },

        {
          key: 'personalIdentityNumber',
          name: 'Pers. Identity No.',
          renderFn: ({ personalIdentityNumber }) => (
            <IconLabel label={personalIdentityNumber} />
          ),
        },

        {
          key: 'phoneNumber',
          name: 'Phone No.',
          renderFn: ({ phoneNumber }) => <IconLabel label={phoneNumber} />,
        },

        {
          key: 'email',
          name: 'Email',
          renderFn: ({ email }) => <IconLabel label={email} />,
        },

        {
          key: 'employeeNumber',
          name: 'Empl. No.',
          renderFn: ({ employeeNumber }) => (
            <IconLabel label={employeeNumber} />
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
      ] as Array<DataTable.Column<Employee>>,
    [],
  );
}
