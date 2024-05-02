import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';

import { Employee } from './types';

//

export interface GetEmployeesRes {
  employees: Employee[];
}

export const createGetEmployees = () => ({
  queryKey: ['employees'],
  queryFn: () =>
    instance
      .get<GetEmployeesRes>(endpoints.employee)
      .then((res) => res.data.employees.map(parseResponseData) as Employee[])
      .catch(createErrorHandler(endpoints.employee)),
});
