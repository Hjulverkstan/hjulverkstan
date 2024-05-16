import { useMutation } from '@tanstack/react-query';
import { invalidateQueries } from '../queries';
import * as api from './api';

export const useCreateEmployeeM = () =>
  useMutation({
    ...api.createCreateEmployee(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetEmployees().queryKey,
        api.createGetEmployee({ id }).queryKey,
      ]),
  });

export const useEditEmployeeM = () =>
  useMutation({
    ...api.createEditEmployee(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetEmployees().queryKey,
        api.createGetEmployee({ id }).queryKey,
      ]),
  });

export const useDeleteEmployeeM = () =>
  useMutation({
    ...api.createDeleteEmployee(),
    onSuccess: () => invalidateQueries([api.createGetEmployees().queryKey]),
  });
