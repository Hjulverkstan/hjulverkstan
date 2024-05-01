import { Store, Warehouse } from 'lucide-react';

import { createFindFn, createMatchFn } from '../enums';
import { LocationType } from './types';

//

export const locationType = [
  {
    dataKey: 'locationType',
    value: LocationType.SHOP,
    name: 'Shop',
    icon: Store,
  },
  {
    dataKey: 'locationType',
    value: LocationType.STORAGE,
    name: 'Storage',
    icon: Warehouse,
  },
];

//

const all = [...locationType];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
