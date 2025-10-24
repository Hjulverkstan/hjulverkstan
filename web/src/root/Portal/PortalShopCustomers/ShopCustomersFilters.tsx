import * as enumsRaw from '@data/customer/enums';

import * as DataTable from '@components/DataTable';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { Customer } from '@data/customer/types';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';

import { PortalFilterDate } from '../PortalFilterDate';
import { matchEnumsBy, matchEnumsOnRow } from '@utils/enums';

export default function ShopCustomerFilters() {
  const enums = useTranslateRawEnums(enumsRaw);
  const ticketEnumsQ = useTicketsAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ({ withOrgPerson: true });

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Customers..."
        matchFn={(word: string, row: Customer) =>
          matchEnumsOnRow(enums, word, row) ||
          DataTable.fuzzyMatchFn(
            ['comment', 'personalIdentityNumber', 'phoneNumber', 'email'],
            word,
            row,
          ) ||
          matchEnumsBy({
            enums: customerEnumsQ.data,
            isOf: row.id,
            includes: word,
          }) ||
          matchEnumsBy({
            enums: ticketEnumsQ.data,
            isOf: row.ticketIds,
            startsWith: word,
          })
        }
      />

      <DataTable.FilterPopover label="Type">
        <DataTable.FilterMultiSelect
          filterKey="customer-type"
          enums={enums.customerType}
        />
      </DataTable.FilterPopover>
      <DataTable.FilterPopover withoutCmdk label="Age">
        <DataTable.FilterSlider filterKey="age" dataKey="age" />
      </DataTable.FilterPopover>

      <PortalFilterDate
        filterOptions={[
          { label: 'Created At', dataKeyFrom: 'createdAt' },
          { label: 'Edited At', dataKeyFrom: 'updatedAt' },
        ]}
      />
    </>
  );
}
