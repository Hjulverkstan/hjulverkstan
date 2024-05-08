import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';

import { User } from './types';

//

export interface GetUsersRes {
  users: User[];
}

export const createGetUsers = () => ({
  queryKey: ['users'],
  queryFn: () =>
    instance
      .get<GetUsersRes>(endpoints.user)
      .then((res) => res.data.users.map(parseResponseData) as User[])
      .catch(createErrorHandler(endpoints.user)),
});

export type GetUserRes = User;

export interface GetUserParams {
  id: string;
}

export const createGetUser = ({ id }: GetUserParams) => ({
  queryKey: ['users', id],
  queryFn: () =>
    instance
      .get<GetUserRes>(`${endpoints.user}/${id}`)
      .then((res) => parseResponseData(res.data) as User)
      .catch(createErrorHandler(endpoints.user)),
});

// MUTATIONS

const transformBody = ({
  id,
  username,
  email,
  password,
  roles,
}: Partial<User>) => ({
  id,
  username,
  email,
  password,
  roles,
});

export type CreateUserRes = User;

export const createCreateUser = () => ({
  mutationFn: (body: CreateUserRes) =>
    instance
      .post<CreateUserRes>(`${endpoints.user}/signup`, transformBody(body))
      .then((res) => parseResponseData(res.data) as User)
      .catch(createErrorHandler(endpoints.user)),
});

export type EditUserRes = User;
export type EditUserParams = User;
export const createEditUser = () => ({
  mutationFn: (body: EditUserParams) =>
    instance
      .put<EditUserRes>(`${endpoints.user}/${body.id}`, transformBody(body))
      .then((res) => parseResponseData(res.data) as User)
      .catch(createErrorHandler(endpoints.user)),
});

export const createDeleteUser = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetUserRes>(`${endpoints.user}/${id}`)
      .then((res) => parseResponseData(res.data) as User)
      .catch(createErrorHandler(endpoints.user)),
});
