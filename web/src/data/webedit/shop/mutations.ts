import { usePortalLang } from '../../../root/Portal/PortalLang';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Shop } from '@data/webedit/shop/types';
import * as api from '@data/webedit/shop/api';

export const useCreateShopM = () => {
  const { selectedLang } = usePortalLang();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Shop) => api.createShop(body, selectedLang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops', selectedLang] });
    },
  });
};

export const useEditShopM = () => {
  const { selectedLang } = usePortalLang();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: Shop) => api.editShop(body.id, body, selectedLang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops', selectedLang] });
    },
  });
};

export const useDeleteShopM = () => {
  const { selectedLang } = usePortalLang();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteShop(id, selectedLang),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shops', selectedLang] });
    },
  });
};
