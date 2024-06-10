import * as enums from '@data/customer/enums';

import * as DataTable from '@components/DataTable';
import { useCustomersAsEnumsQ } from '@data/customer/queries';
import { Customer } from '@data/customer/types';
import { enumsMatchUtil } from '@data/enums';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';

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
            [
              'comment',
              'personalIdentityNumber',
              'phoneNumber',
              'email',
              'address',
            ],
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
    </>
  );
}
