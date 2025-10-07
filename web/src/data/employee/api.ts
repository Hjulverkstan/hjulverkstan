import { createErrorHandler, endpoints, instance } from '../api';
import { ListResponse } from '../types';

import { Employee } from './types';

// GET ALL

export type GetEmployeesRes = ListResponse<Employee>;

export const createGetEmployees = () => ({
  queryKey: [endpoints.employee],
  queryFn: () =>
    instance
      .get<GetEmployeesRes>(endpoints.employee)
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.employee)),
});

// GET

export type GetEmployeeRes = Employee;
export interface GetEmployeeParams {
  id: string;
}

export const createGetEmployee = ({ id }: GetEmployeeParams) => ({
  queryKey: [endpoints.employee, id],
  queryFn: () =>
    instance
      .get<GetEmployeeRes>(`${endpoints.employee}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.employee)),
});

// CREATE

export type CreateEmployeeRes = Employee;
export type CreateEmployeeParams = Omit<Employee, 'id'>;

export const createCreateEmployee = () => ({
  mutationFn: (body: CreateEmployeeParams) =>
    instance
      .post<CreateEmployeeRes>(endpoints.employee, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.employee)),
});

// EDIT

export type EditEmployeeRes = Employee;
export type EditEmployeeParams = Employee;

export const createEditEmployee = () => ({
  mutationFn: (body: EditEmployeeParams) =>
    instance
      .put<EditEmployeeRes>(`${endpoints.employee}/${body.id}`, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.employee)),
});

// DELETE

export const createDeleteEmployee = () => ({
  mutationFn: (id: string) =>
    instance
      .delete(`${endpoints.employee}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.employee)),
});
