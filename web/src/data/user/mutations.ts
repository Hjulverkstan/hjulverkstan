import { useMutation } from 'react-query';
import { invalidateQueries } from '../queries';
import * as api from './api';

export const useCreateUserM = () =>
  useMutation({
    ...api.createCreateUser(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetUsers().queryKey,
        api.createGetUser({ id }).queryKey,
      ]),
  });

export const useEditUserM = () =>
  useMutation({
    ...api.createEditUser(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetUsers().queryKey,
        api.createGetUser({ id }).queryKey,
      ]),
  });

export const useDeleteUserM = () =>
  useMutation({
    ...api.createDeleteUser(),
    onSuccess: () => invalidateQueries([api.createGetUsers().queryKey]),
  });
