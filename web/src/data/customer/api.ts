import { createErrorHandler, endpoints, instance } from '../api';

import { Customer } from './types';

// GET ALL

export interface GetCustomersRes {
  customers: Customer[];
}

export const createGetCustomers = () => ({
  queryKey: [endpoints.customer],
  queryFn: () =>
    instance
      .get<GetCustomersRes>(endpoints.customer)
      .then((res) => res.data.customers)
      .catch(createErrorHandler(endpoints.customer)),
});

// GET

export type GetCustomerRes = Customer;
export interface GetCustomerParams {
  id: string;
}

export const createGetCustomer = ({ id }: GetCustomerParams) => ({
  queryKey: [endpoints.customer, id],
  queryFn: () =>
    instance
      .get<GetCustomerRes>(`${endpoints.customer}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.customer)),
});

// CREATE

export type CreateCustomerRes = Customer;
export type CreateCustomerParams = Omit<Customer, 'id'>;

export const createCreateCustomer = () => ({
  mutationFn: (body: CreateCustomerParams) =>
    instance
      .post<CreateCustomerRes>(endpoints.customer, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.customer)),
});

// EDIT

export type EditCustomerRes = Customer;
export type EditCustomerParams = Customer;

export const createEditCustomer = () => ({
  mutationFn: ({ id, ...body }: EditCustomerParams) =>
    instance
      .put<EditCustomerRes>(`${endpoints.customer}/${id}`, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.customer)),
});

// DELETE

export const createDeleteCustomer = () => ({
  mutationFn: (id: string) =>
    instance
      .delete(`${endpoints.customer}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.customer)),
});
