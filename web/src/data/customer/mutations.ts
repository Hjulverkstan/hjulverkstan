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

export const useHardDeleteCustomerM = () =>
  useMutation({
    ...api.createDeleteCustomer(),
    onSuccess: () => invalidateQueries([api.createGetCustomers().queryKey]),
  });

export const useSoftDeleteCustomerM = () =>
  useMutation({
    ...api.createSoftDeleteCustomer(),
    onSuccess: () => invalidateQueries([api.createGetCustomers().queryKey]),
  });
