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

        {
          key: 'createdat',
          name: 'Created at',
          renderFn: ({ createdAt }) => (
            <IconLabel label={format(new Date(createdAt), 'yyyy-MM-dd')} />
          ),
        },

        {
          key: 'updatedat',
          name: 'Updated at',
          renderFn: ({ updatedAt }) => (
            <IconLabel label={format(new Date(updatedAt), 'yyyy-MM-dd')} />
          ),
        },
      ] as Array<DataTable.Column<Employee>>,
    [],
  );
}
