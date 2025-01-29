import { useQuery } from '@tanstack/react-query';
import * as api from './api';
import { usePortalLang } from '../../../root/Portal/PortalLang';
export const useShopsQ = ({ lang }: { lang: string }) =>
  useQuery({
    queryKey: ['shops', lang],
    queryFn: () => api.getShops(lang),
    enabled: !!lang,
  });

export const useShopQ = ({ id }: { id: string }) => {
  const { selectedLang } = usePortalLang();
  return useQuery({
    queryKey: ['shop', id, selectedLang],
    queryFn: async () => {
      if (!id) throw new Error("Missing 'id' for shop query.");
      return api.getShop(id, selectedLang);
    },
    enabled: !!id,
  });
};
