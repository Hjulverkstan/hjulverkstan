import * as DataTable from '@components/DataTable';
import * as enumsRaw from '@data/webedit/text/enums';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { matchEnumsOnRow } from '@utils/enums';
import { Shop } from '@data/webedit/shop/types';

export default function AdminShopFilters() {
  const enums = useTranslateRawEnums(enumsRaw);
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Shop..."
        matchFn={(word: string, row: Shop) =>
          matchEnumsOnRow(enums, word, row) ||
          DataTable.fuzzyMatchFn(
            ['name', 'address', 'latitude', 'longitude', 'slug'],
            word,
            row,
          )
        }
      />
    </>
  );
}
