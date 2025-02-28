import * as DataTable from '@components/DataTable';
import { PortalFilterDate } from '../PortalFilterDate';
import { GeneralContent } from '@data/webedit/general/types';

export default function WebEditGeneralContentFilters() {
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in General Content..."
        matchFn={(
          word: string,
          row: Pick<GeneralContent, 'name' | 'description' | 'value'>,
        ) =>
          DataTable.fuzzyMatchFn(['name', 'description', 'value'], word, row)
        }
      />
      <PortalFilterDate
        filterOptions={[{ label: 'Edited At', dataKeyFrom: 'updatedAt' }]}
      />
    </>
  );
}
