import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from './index';

export enum CustomerType {
  PERSON = 'PERSON',
  ORG = 'ORGANIZATION',
}

export interface Customer {
  id: string;
  customerType: CustomerType;
  firstName: string;
  lastName: string;
  personalIdentityNumber: string;
  organizationName?: string;
  phoneNumber: string;
  email: string;
  ticketIds: string[];
  comment?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
//

export interface GetCustomersRes {
  customers: Customer[];
}

export const createGetCustomers = () => ({
  queryKey: ['customers'],
  queryFn: () =>
    instance
      .get<GetCustomersRes>(endpoints.customer)
      .then((res) => res.data.customers.map(parseResponseData) as Customer[])
      .catch(createErrorHandler(endpoints.customer)),
});
