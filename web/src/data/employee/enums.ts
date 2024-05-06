import { Building, UserCircle } from 'lucide-react';

import { createFindFn, createMatchFn } from '../enums';
import { CustomerType } from './types';

//

export const type = [
  {
    dataKey: 'customerType',
    value: CustomerType.ORG,
    label: 'Organization',
    icon: Building,
  },
  {
    dataKey: 'customerType',
    value: CustomerType.PERSON,
    label: 'Person',
    icon: UserCircle,
  },
];

//

const all = [...type];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
