import { useQuery } from 'react-query';

import { EnumAttributes } from '../enums';
import { ErrorRes } from '../api';
import { Customer, CustomerType } from './types';
import * as api from './api';
import * as enums from './enums';

//

export const useCustomersQ = () =>
  useQuery<Customer[], ErrorRes>(api.createGetCustomers());

export interface UseCustomerQProps {
  id: string;
}

export const useCustomerQ = ({ id }: UseCustomerQProps) =>
  useQuery<Customer, ErrorRes>({
    ...api.createGetCustomer({ id }),
    enabled: !!id,
  });

//

export const useCustomersAsEnumsQ = ({ dataKey = 'customerId' } = {}) =>
  useQuery<Customer[], ErrorRes, EnumAttributes[]>({
    ...api.createGetCustomers(),
    select: (customers) =>
      customers?.map((customer) => ({
        dataKey,
        icon: enums.find(customer.customerType).icon,
        label:
          customer.customerType === CustomerType.PERSON
            ? `${customer.firstName} ${customer.lastName}`
            : customer.organizationName!,
        value: customer.id,
      })) ?? [],
  });
