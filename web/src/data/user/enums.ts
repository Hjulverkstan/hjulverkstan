import { User, UserCog } from 'lucide-react';

import { AuthRole } from '@data/auth/types';
import { createFindFn, createMatchFn } from '../enums';

//

export const roles = [
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

//

const all = [...roles];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
