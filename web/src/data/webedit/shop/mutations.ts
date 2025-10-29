import { useMutation } from '@tanstack/react-query';

import { invalidateQueries } from '../../queries';
import * as api from './api';

export const useCreateShopM = () =>
  useMutation({
    ...api.createCreateShop(),
    onSuccess: ({ id }, { locale }) =>
      invalidateQueries([
        api.createGetShops({ locale }).queryKey,
        api.createGetShop({ id, locale }).queryKey,
      ]),
  });

export const useEditShopM = () =>
  useMutation({
    ...api.createEditShop(),
    onSuccess: ({ id }, { locale }) =>
      invalidateQueries([
        api.createGetShops({ locale }).queryKey,
        api.createGetShop({ id, locale }).queryKey,
      ]),
  });

export const useDeleteShopM = () =>
  useMutation({
    ...api.createDeleteShop(),
    onSuccess: (_, { locale }) =>
      invalidateQueries([api.createGetShops({ locale }).queryKey]),
  });
