import { createErrorHandler, endpoints, instance } from '../api';
import { ListResponse } from '../types';

import { User } from './types';

// GET ALL

export type GetUsersRes = ListResponse<User>;

export const createGetUsers = () => ({
  queryKey: [endpoints.user],
  queryFn: () =>
    instance
      .get<GetUsersRes>(endpoints.user)
      .then((res) => res.data.content)
      .catch(createErrorHandler(endpoints.user)),
});

// GET

export type GetUserRes = User;
export interface GetUserParams {
  id: string;
}

export const createGetUser = ({ id }: GetUserParams) => ({
  queryKey: [endpoints.user, id],
  queryFn: () =>
    instance
      .get<GetUserRes>(`${endpoints.user}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.user)),
});

// CREATE

export type CreateUserRes = User;
export type CreateUserParams = Omit<User, 'id'>;

export const createCreateUser = () => ({
  mutationFn: (body: CreateUserParams) =>
    instance
      .post<CreateUserRes>(`${endpoints.user}`, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.user)),
});

// EDIT

export type EditUserRes = User;
export type EditUserParams = User;

export const createEditUser = () => ({
  mutationFn: ({ id, ...body }: EditUserParams) =>
    instance
      .put<EditUserRes>(`${endpoints.user}/${id}`, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.user)),
});

// DELETE

export const createDeleteUser = () => ({
  mutationFn: (id: string) =>
    instance
      .delete(`${endpoints.user}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.user)),
});
