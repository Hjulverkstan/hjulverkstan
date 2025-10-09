import { Building, UserCircle } from 'lucide-react';

import { EnumAttributes } from '@data/enums';
import { CustomerType } from './types';

//

export const customerType: EnumAttributes[] = [
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
