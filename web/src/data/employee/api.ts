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
      .then(
        (res) =>
          res.data.employees.map(parseResponseData).reverse() as Employee[],
      )
      .catch(createErrorHandler(endpoints.employee)),
});

export type GetEmployeeRes = Employee;

export interface GetEmployeeParams {
  id: string;
}

export const createGetEmployee = ({ id }: GetEmployeeParams) => ({
  queryKey: ['vehicle', id],
  queryFn: () =>
    instance
      .get<GetEmployeeRes>(`${endpoints.employee}/${id}`)
      .then((res) => parseResponseData(res.data) as Employee)
      .catch(createErrorHandler(endpoints.employee)),
});

// MUTATIONS

const transformBody = ({
  id,
  employeeType,
  vehicleIds,
  address,
  name,
  comment,
}: Partial<Employee>) => ({
  id,
  employeeType,
  vehicleIds,
  address,
  name,
  comment,
});

export type CreateEmployeeRes = Employee;

export const createCreateEmployee = () => ({
  mutationFn: (body: CreateEmployeeRes) =>
    instance
      .post<CreateEmployeeRes>(endpoints.employee, transformBody(body))
      .then((res) => parseResponseData(res.data) as Employee)
      .catch(createErrorHandler(endpoints.employee)),
});

export type EditEmployeeRes = Employee;
export type EditEmployeeParams = Employee;
export const createEditEmployee = () => ({
  mutationFn: (body: EditEmployeeParams) =>
    instance
      .put<EditEmployeeRes>(
        `${endpoints.employee}/${body.id}`,
        transformBody(body),
      )
      .then((res) => parseResponseData(res.data) as Employee)
      .catch(createErrorHandler(endpoints.employee)),
});

export const createDeleteEmployee = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetEmployeeRes>(`${endpoints.employee}/${id}`)
      .then((res) => parseResponseData(res.data) as Employee)
      .catch(createErrorHandler(endpoints.employee)),
});
