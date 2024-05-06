import { Building, UserCircle } from 'lucide-react';

import { createFindFn, createMatchFn } from '../enums';
import { CustomerType } from './types';

//

export const customerType = [
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

const all = [...customerType];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
