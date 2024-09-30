import * as enums from '@data/customer/enums';

import * as DataTable from '@components/DataTable';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { Customer } from '@data/customer/types';
import { enumsMatchUtil } from '@data/enums';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';
import { CalendarIcon } from 'lucide-react';
import { PortalFilterDate } from '../PortalFilterDate';

export default function ShopCustomerFilters() {
  const ticketEnumsQ = useTicketsAsEnumsQ();
  const customerEnumsQ = useCustomersAsEnumsQ({ withOrgPerson: true });

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search in Customers..."
        matchFn={(word: string, row: Customer) =>
          enums.matchFn(word, row) ||
          DataTable.fuzzyMatchFn(
            ['comment', 'personalIdentityNumber', 'phoneNumber', 'email'],
            word,
            row,
          ) ||
          enumsMatchUtil({
            enums: customerEnumsQ.data,
            isOf: row.id,
            includes: word,
          }) ||
          enumsMatchUtil({
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

      <PortalFilterDate
        label={<CalendarIcon />}
        filterOptions={[
          { label: 'Created At', dataKeyFrom: 'createdAt' },
          { label: 'Edited At', dataKeyFrom: 'updatedAt' },
        ]}
      />
    </>
  );
}
