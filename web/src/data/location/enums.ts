import { Store, Warehouse } from 'lucide-react';

import { LocationType } from './types';
import { EnumAttributes } from '@data/enums';

//

export const locationType: EnumAttributes[] = [
  {
    dataKey: 'locationType',
    value: LocationType.SHOP,
    label: 'Shop',
    icon: Store,
  },
  {
    dataKey: 'locationType',
    value: LocationType.STORAGE,
    label: 'Storage',
    icon: Warehouse,
  },
];
