import * as DataTable from '@components/DataTable';
import { GeneralContent } from '@data/webedit/general/types';

export default function WebEditGeneralContentFilters() {
  return (
    <DataTable.FilterSearch
      placeholder="Search in general contents..."
      matchFn={(word: string, row: GeneralContent) =>
        DataTable.fuzzyMatchFn(
          ['name', 'key', 'value', 'description'],
          word,
          row,
        )
      }
    />
  );
}
