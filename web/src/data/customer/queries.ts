import { useQuery } from '@tanstack/react-query';

import { EnumAttributes } from '../enums';
import { StandardError } from '../api';
import { AggregatedCustomer, Customer, CustomerType } from './types';
import * as api from './api';
import * as enums from './enums';
import { differenceInYears, parse } from 'date-fns';

//

export const calculateAge = (persIdNo: string) =>
  differenceInYears(
    new Date(),
    parse(persIdNo.substring(0, 8), 'yyyyMMdd', new Date()),
  );

export const useCustomersQ = () =>
  useQuery<Customer[], StandardError>({
    ...api.createGetCustomers(),
    select: (customers) =>
      customers.map((customer) => ({
        ...customer,
        age: calculateAge(customer.personalIdentityNumber),
      })) as AggregatedCustomer[],
  });

//

export interface UseCustomerQProps {
  id: string;
}

export const useCustomerQ = ({ id }: UseCustomerQProps) =>
  useQuery<Customer, StandardError>({
    ...api.createGetCustomer({ id }),
    enabled: !!id,
  });

//

export const useCustomersAsEnumsQ = ({
  dataKey = 'customerId',
  withOrgPerson = false,
} = {}) =>
  useQuery<Customer[], StandardError, EnumAttributes[]>({
    ...api.createGetCustomers(),
    select: (customers) =>
      customers?.map((customer) => ({
        dataKey,
        icon: enums.find(customer.customerType).icon,
        label:
          customer.customerType === CustomerType.PERSON
            ? `${customer.firstName} ${customer.lastName}`
            : withOrgPerson
              ? `${customer.organizationName} (${customer.firstName} ${customer.lastName})`
              : customer.organizationName!,
        value: customer.id,
      })) ?? [],
  });
