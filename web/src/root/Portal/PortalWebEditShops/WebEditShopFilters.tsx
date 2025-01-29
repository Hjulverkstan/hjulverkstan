import * as DataTable from '@components/DataTable';

export default function WebEditShopFilters() {
  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Shops..."
        matchFn={(word, row) =>
          DataTable.fuzzyMatchFn(['name', 'address', 'bodyText'], word, row)
        }
      />
      <DataTable.FilterPopover label="Details">
        <DataTable.FilterMultiSelect
          filterKey="name"
          heading="Name"
          enums={[]}
        />
        <DataTable.FilterMultiSelect
          filterKey="address"
          heading="Address"
          enums={[]}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover label="Opening Hours">
        <DataTable.FilterMultiSelect
          filterKey="openHours"
          heading="Open Hours"
          enums={[]}
        />
      </DataTable.FilterPopover>
    </>
  );
}
