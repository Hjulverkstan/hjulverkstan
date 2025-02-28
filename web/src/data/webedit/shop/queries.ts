import { useQuery } from '@tanstack/react-query';
import { Shop } from './types';
import { StandardError } from '@data/api';
import * as api from './api';
import { usePortalLang } from '../../../root/Portal/PortalLang';

export const useShopsQ = () => {
  const { selectedLang } = usePortalLang();
  return useQuery<Shop[], StandardError>(api.createGetShops(selectedLang));
};

export interface UseShopQProps {
  id: string;
}

export const useShopQ = ({ id }: UseShopQProps) => {
  const { selectedLang } = usePortalLang();
  return useQuery<Shop, StandardError>({
    ...api.createGetShop({ id, lang: selectedLang }),
    enabled: !!id,
  });
};
