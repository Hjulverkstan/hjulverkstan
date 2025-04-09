import { useMemo } from 'react';
import type { OpenHours } from '@data/webedit/shop/types';
import { isShopOpen } from '@data/webedit/shop/utils';

export function useShopOpenStatus(
  openHoursData: OpenHours | undefined | null,
): boolean {
  const isOpen = useMemo(() => {
    const now = new Date();
    return isShopOpen(openHoursData, now);
  }, [openHoursData]);

  return isOpen;
}
