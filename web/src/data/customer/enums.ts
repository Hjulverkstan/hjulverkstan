import { Building, UserCircle } from 'lucide-react';

import { EnumAttributesRaw } from '@data/types';
import { CustomerType } from './types';

//

export const customerType: EnumAttributesRaw[] = [
  {
    dataKey: 'customerType',
    value: CustomerType.ORG,
    translationKey: 'enumIsCustomerTypeOrg',
    icon: Building,
  },
  {
    dataKey: 'customerType',
    value: CustomerType.PERSON,
    translationKey: 'enumIsCustomerTypeCustomer',
    icon: UserCircle,
  },
];
