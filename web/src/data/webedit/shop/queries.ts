import { useQuery } from '@tanstack/react-query';
import { Shop } from './types';
import { StandardError } from '@data/api';
import * as api from './api';
import { usePortalLang } from '../../../root/Portal/PortalLang';

const flattenShopData = (data: Shop | undefined) => {
  if (!data) {
    return undefined;
  }
  const openHours = data.openHours || {};
  return {
    ...data,
    'openHours.mon': openHours.mon,
    'openHours.tue': openHours.tue,
    'openHours.wed': openHours.wed,
    'openHours.thu': openHours.thu,
    'openHours.fri': openHours.fri,
    'openHours.sat': openHours.sat,
    'openHours.sun': openHours.sun,
  };
};

type FlatShopData = ReturnType<typeof flattenShopData>;

export const useShopsQ = () => {
  const { selectedLang } = usePortalLang();
  return useQuery<Shop[], StandardError>(api.createGetShops(selectedLang));
};

export interface UseShopQProps {
  id: string;
}

export const useShopQ = ({ id }: UseShopQProps) => {
  const { selectedLang } = usePortalLang();
  return useQuery<Shop, StandardError, FlatShopData>({
    ...api.createGetShop({ id, lang: selectedLang }),
    enabled: !!id,
    select: flattenShopData,
  });
};
