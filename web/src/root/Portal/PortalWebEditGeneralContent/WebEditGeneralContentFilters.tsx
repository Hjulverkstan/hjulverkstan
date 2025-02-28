import * as DataTable from '@components/DataTable';
import { PortalFilterDate } from '../PortalFilterDate';

export default function WebEditGeneralContentFilters() {
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in General Content..."
        matchFn={(
          word: string,
          row: { name: string; description: string; value: string },
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
