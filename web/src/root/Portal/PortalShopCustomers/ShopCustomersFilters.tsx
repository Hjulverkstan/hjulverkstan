import * as enums from '@data/customer/enums';

import * as DataTable from '@components/DataTable';
import { Customer } from '@data/customer/types';
import { useTicketsAsEnumsQ } from '@data/ticket/queries';

export default function ShopCustomerFilters() {
  const ticketEnumsQ = useTicketsAsEnumsQ();

  return (
    <>
      <DataTable.FilterSearch
        placeholder="Search..."
        matchFn={(word: string, row: Customer) =>
          enums.matchFn(word, row) ||
          ticketEnumsQ.data?.some((e) => e.label.startsWith(word)) ||
          DataTable.fuzzyMatchFn(
            [
              'comment',
              'firstName',
              'lastName',
              'personalIdentityNumber',
              'phoneNumber',
              'email',
            ],
            word,
            row,
          )
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
