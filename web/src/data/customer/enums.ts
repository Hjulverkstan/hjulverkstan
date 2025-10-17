import { Building, UserCircle } from 'lucide-react';

import { EnumAttributesRaw } from '@data/enums';
import { CustomerType } from './types';

//

export const customerType: EnumAttributesRaw[] = [
  {
    dataKey: 'customerType',
    value: CustomerType.ORG,
    translationKey: 'enumIsCustomerOwnedOrg',
    icon: Building,
  },
  {
    dataKey: 'customerType',
    value: CustomerType.PERSON,

    translationKey: 'enumIsCustomerOwnedCustomer',
    icon: UserCircle,
  },
];
