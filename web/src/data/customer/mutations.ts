import { useMutation } from '@tanstack/react-query';
import { invalidateQueries } from '../queries';
import * as api from './api';

export const useCreateCustomerM = () =>
  useMutation({
    ...api.createCreateCustomer(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetCustomers().queryKey,
        api.createGetCustomer({ id }).queryKey,
      ]),
  });

export const useEditCustomerM = () =>
  useMutation({
    ...api.createEditCustomer(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetCustomers().queryKey,
        api.createGetCustomer({ id }).queryKey,
      ]),
  });

export const useDeleteCustomerM = () =>
  useMutation({
    ...api.createDeleteCustomer(),
    onSuccess: () => invalidateQueries([api.createGetCustomers().queryKey]),
  });
