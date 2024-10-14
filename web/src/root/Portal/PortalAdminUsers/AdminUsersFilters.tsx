import * as DataTable from '@components/DataTable';
import * as enums from '@data/user/enums';
import { User } from '@data/user/types';
import { PortalFilterDate } from '../PortalFilterDate';

export default function AdminUserFilters() {
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Users..."
        matchFn={(word: string, row: User) =>
          enums.matchFn(word, row) ||
          DataTable.fuzzyMatchFn(['username', 'email'], word, row)
        }
      />

      <PortalFilterDate
        filterOptions={[
          { label: 'Created At', dataKeyFrom: 'createdAt' },
          { label: 'Edited At', dataKeyFrom: 'updatedAt' },
        ]}
      />
    </>
  );
}
