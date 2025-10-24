import { useQuery } from '@tanstack/react-query';
import { differenceInYears, parse } from 'date-fns';

import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import * as enumsRaw from '@data/customer/enums';

import { EnumAttributes } from '../types';
import { StandardError } from '../api';
import { AggregatedCustomer, Customer, CustomerType } from './types';
import * as api from './api';
import { findEnum } from '@utils/enums';

//

export const calculateAge = (persIdNo?: string | null) =>
  !persIdNo
    ? undefined
    : differenceInYears(
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
} = {}) => {
  const enums = useTranslateRawEnums(enumsRaw);

  return useQuery<Customer[], StandardError, EnumAttributes[]>({
    ...api.createGetCustomers(),
    select: (customers) =>
      customers?.map((customer) => ({
        dataKey,
        icon: findEnum(enums, customer.customerType).icon,
        label:
          customer.customerType === CustomerType.PERSON
            ? `${customer.firstName} ${customer.lastName}`
            : withOrgPerson
              ? `${customer.organizationName} (${customer.firstName} ${customer.lastName})`
              : customer.organizationName!,
        value: customer.id,
      })) ?? [],
  });
};
