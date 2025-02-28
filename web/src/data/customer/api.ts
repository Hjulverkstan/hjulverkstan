import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';

import { Customer } from './types';

//

export interface GetCustomersRes {
  customers: Customer[];
}

export const createGetCustomers = () => ({
  queryKey: ['customers'],
  queryFn: () =>
    instance
      .get<GetCustomersRes>(endpoints.customer)
      .then(
        (res) =>
          res.data.customers.map(parseResponseData).reverse() as Customer[],
      )
      .catch(createErrorHandler(endpoints.customer)),
});

export type GetCustomerRes = Customer;

export interface GetCustomerParams {
  id: string;
}

export const createGetCustomer = ({ id }: GetCustomerParams) => ({
  queryKey: ['vehicle', id],
  queryFn: () =>
    instance
      .get<GetCustomerRes>(`${endpoints.customer}/${id}`)
      .then((res) => parseResponseData(res.data) as Customer)
      .catch(createErrorHandler(endpoints.customer)),
});

// MUTATIONS

const transformBody = ({
  id,
  customerType,
  firstName,
  lastName,
  personalIdentityNumber,
  phoneNumber,
  email,
  ticketIds,
  comment,
  organizationName,
}: Partial<Customer>) => ({
  id,
  customerType,
  firstName,
  lastName,
  personalIdentityNumber,
  phoneNumber,
  email,
  ticketIds,
  comment,
  organizationName,
});

export type CreateCustomerRes = Customer;

export const createCreateCustomer = () => ({
  mutationFn: (body: CreateCustomerRes) =>
    instance
      .post<CreateCustomerRes>(endpoints.customer, transformBody(body))
      .then((res) => parseResponseData(res.data) as Customer)
      .catch(createErrorHandler(endpoints.customer)),
});

export type EditCustomerRes = Customer;
export type EditCustomerParams = Customer;
export const createEditCustomer = () => ({
  mutationFn: (body: EditCustomerParams) =>
    instance
      .put<EditCustomerRes>(
        `${endpoints.customer}/${body.id}`,
        transformBody(body),
      )
      .then((res) => parseResponseData(res.data) as Customer)
      .catch(createErrorHandler(endpoints.customer)),
});

export const createDeleteCustomer = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetCustomerRes>(`${endpoints.customer}/${id}`)
      .then((res) => parseResponseData(res.data) as Customer)
      .catch(createErrorHandler(endpoints.customer)),
});
