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
      .then((res) => res.data.customers.map(parseResponseData) as Customer[])
      .catch(createErrorHandler(endpoints.customer)),
});
