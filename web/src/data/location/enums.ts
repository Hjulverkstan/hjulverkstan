import { Store, Warehouse } from 'lucide-react';

import { LocationType } from './types';
import { EnumAttributesRaw } from '@data/types';

//

export const locationType: EnumAttributesRaw[] = [
  {
    dataKey: 'locationType',
    value: LocationType.SHOP,
    translationKey: 'enumLocationTypeShop',
    icon: Store,
  },
  {
    dataKey: 'locationType',
    value: LocationType.STORAGE,
    translationKey: 'enumLocationTypeStorage',
    icon: Warehouse,
  },
];
