import { useMutation } from '@tanstack/react-query';
import { invalidateQueries } from '@data/queries';
import * as api from './api';
import { usePortalLang } from '../../../root/Portal/PortalLang';

export const useCreateShopM = () => {
  const { selectedLang } = usePortalLang();
  return useMutation({
    ...api.createCreateShop(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetShops(selectedLang).queryKey,
        api.createGetShop({ id, lang: selectedLang }).queryKey,
      ]),
  });
};

export const useEditShopM = () => {
  const { selectedLang } = usePortalLang();
  return useMutation({
    ...api.createEditShop(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetShops(selectedLang).queryKey,
        api.createGetShop({ id, lang: selectedLang }).queryKey,
      ]),
  });
};

export const useDeleteShopM = () =>
  useMutation({
    ...api.createDeleteShop(),
    onSuccess: () => invalidateQueries([api.createGetShops().queryKey]),
  });
