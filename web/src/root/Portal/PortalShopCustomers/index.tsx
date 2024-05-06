import { useParams } from 'react-router-dom';

import { customerZ, initCustomer } from '@data/customer/form';
import { useCreateCustomerM, useEditCustomerM } from '@data/customer/mutations';
import { useCustomerQ, useCustomersQ } from '@data/customer/queries';

import * as DataForm from '@components/DataForm';
import { Mode } from '@components/DataForm';
import * as DataTable from '@components/DataTable';

import { PageContentProps } from '..';
import PortalContent from '../PortalContent';
import PortalForm from '../PortalForm';
import PortalTable from '../PortalTable';
import PortalToolbar from '../PortalToolbar';

import { useTicketsQ } from '@data/ticket/queries';
import ShopCustomersActions from './ShopCustomersActions';
import ShopCustomersFields from './ShopCustomersFields';
import ShopCustomersFilters from './ShopCustomersFilters';
import useColumns from './useColumns';

//

export default function PortalShopCustomers({ mode }: PageContentProps) {
  const { id = '' } = useParams();

  const customersQ = useCustomersQ();
  const customerQ = useCustomerQ({ id });
  const createCustomerM = useCreateCustomerM();
  const editCustomerM = useEditCustomerM();

  // Ticket's error and loading needs to be handled here
  const ticketsQ = useTicketsQ();

  const columns = useColumns();

  return (
    <DataTable.Provider
      key="customers"
      tableKey="customers"
      disabled={mode && mode !== Mode.READ}
      data={customersQ.data}
    >
      <PortalToolbar dataLabel="customer">
        <ShopCustomersFilters />
      </PortalToolbar>
      <PortalContent>
        <PortalTable
          actionsComponent={ShopCustomersActions}
          columns={columns}
          isLoading={customersQ.isLoading || ticketsQ.isLoading}
          error={customersQ.error || ticketsQ.error}
        />
        {mode && (
          <DataForm.Provider
            mode={mode}
            isLoading={customerQ.isLoading}
            data={customerQ.data}
            zodSchema={customerZ}
            initCreateBody={initCustomer}
          >
            <PortalForm
              dataLabel="Customer"
              error={customerQ.error}
              isSubmitting={
                createCustomerM.isLoading || editCustomerM.isLoading
              }
              saveMutation={editCustomerM.mutateAsync}
              createMutation={createCustomerM.mutateAsync}
            >
              <ShopCustomersFields />
            </PortalForm>
          </DataForm.Provider>
        )}
      </PortalContent>
    </DataTable.Provider>
  );
}
