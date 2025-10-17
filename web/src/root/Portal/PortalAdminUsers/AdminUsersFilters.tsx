import * as DataTable from '@components/DataTable';
import * as enumsRaw from '@data/user/enums';
import { User } from '@data/user/types';
import { PortalFilterDate } from '../PortalFilterDate';
import { useEnums } from '@hooks/useEnums';

export default function AdminUserFilters() {
  const enums = useEnums(enumsRaw);
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
