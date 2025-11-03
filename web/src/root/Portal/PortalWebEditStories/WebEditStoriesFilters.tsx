import * as DataTable from '@components/DataTable';
import * as enumsRaw from '@data/webedit/text/enums';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { matchEnumsOnRow } from '@utils/enums';
import { Story } from '@data/webedit/story/types';

export default function AdminStoriesFilters() {
  const enums = useTranslateRawEnums(enumsRaw);
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Stories..."
        matchFn={(word: string, row: Story) =>
          matchEnumsOnRow(enums, word, row) ||
          DataTable.fuzzyMatchFn(['title', 'slug'], word, row)
        }
      />
    </>
  );
}
