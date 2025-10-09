import { User, UserCog } from 'lucide-react';

import { AuthRole } from '@data/auth/types';
import { EnumAttributes } from '@data/enums';

//

export const roles: EnumAttributes[] = [
  {
    dataKey: 'roles',
    value: AuthRole.USER,
    label: 'User',
    icon: User,
  },
  {
    dataKey: 'roles',
    value: AuthRole.ADMIN,
    label: 'Admin',
    icon: UserCog,
  },
];
