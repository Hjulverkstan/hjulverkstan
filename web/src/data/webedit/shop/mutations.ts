import { useMutation } from '@tanstack/react-query';

import { invalidateQueries } from '../../queries';
import * as api from './api';

export const useCreateShopM = () =>
  useMutation({
    ...api.createCreateShop(),
    onSuccess: ({ id }, { lang }) =>
      invalidateQueries([
        api.createGetShops({ lang }).queryKey,
        api.createGetShop({ id, lang }).queryKey,
      ]),
  });

export const useEditShopM = () =>
  useMutation({
    ...api.createEditShop(),
    onSuccess: ({ id }, { lang }) =>
      invalidateQueries([
        api.createGetShops({ lang }).queryKey,
        api.createGetShop({ id, lang }).queryKey,
      ]),
  });

export const useDeleteShopM = () =>
  useMutation({
    ...api.createDeleteShop(),
    onSuccess: (_, { lang }) =>
      invalidateQueries([api.createGetShops({ lang }).queryKey]),
  });
