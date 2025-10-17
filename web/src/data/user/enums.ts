import { User, UserCog } from 'lucide-react';

import { AuthRole } from '@data/auth/types';
import { EnumAttributesRaw } from '@data/enums';

export const roles: EnumAttributesRaw[] = [
  {
    dataKey: 'roles',
    value: AuthRole.USER,
    translationKey: 'enumRolesUser',
    icon: User,
  },
  {
    dataKey: 'roles',
    value: AuthRole.ADMIN,
    translationKey: 'enumRolesAdmin',
    icon: UserCog,
  },
];
