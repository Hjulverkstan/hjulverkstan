import * as DataTable from '@components/DataTable';
import * as enums from '@data/user/enums';
import { User } from '@data/user/types';

export default function AdminUserFilters() {
  return (
    <DataTable.FilterSearch
      placeholder="Search..."
      matchFn={(word: string, row: User) =>
        enums.matchFn(word, row) ||
        DataTable.fuzzyMatchFn(['username', 'email'], word, row)
      }
    />
  );
}
