import * as DataTable from '@components/DataTable';

export default function WebEditGeneralContentFilters() {
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search content..."
        matchFn={(word, row) =>
          row.name.toLowerCase().includes(word.toLowerCase()) ||
          row.description.toLowerCase().includes(word.toLowerCase()) ||
          row.value.toLowerCase().includes(word.toLowerCase())
        }
      />
    </>
  );
}
