import * as DataTable from '@components/DataTable';
import * as enumsRaw from '@data/user/enums';
import { User } from '@data/user/types';
import { PortalFilterDate } from '../PortalFilterDate';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { matchEnumsOnRow } from '@utils/enums';

export default function AdminUserFilters() {
  const enums = useTranslateRawEnums(enumsRaw);
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Users..."
        matchFn={(word: string, row: User) =>
          matchEnumsOnRow(enums, word, row) ||
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
