import * as DataTable from '@components/DataTable';
import * as enumsRaw from '@data/webedit/text/enums';
import { Text } from '@data/webedit/text/types';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { matchEnumsOnRow } from '@utils/enums';

export default function AdminTextFilters() {
  const enums = useTranslateRawEnums(enumsRaw);
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Text..."
        matchFn={(word: string, row: Text) =>
          matchEnumsOnRow(enums, word, row) ||
          DataTable.fuzzyMatchFn(['value'], word, row)
        }
      />
    </>
  );
}
