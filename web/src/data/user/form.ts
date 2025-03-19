import { z } from 'zod';

import { AuthRole } from '@data/auth/types';
import { User } from '@data/user/types';

import { isReq, reqString } from '../form';

//

export const initUser = {
  roles: [],
} as Partial<User>;

export const userZ = z.object({
  roles: z
    .array(z.nativeEnum(AuthRole, isReq('User role is required')))
    .min(1, 'At least one role is required'),
  username: reqString('Username'),
  email: reqString('Email').email({
    message: 'The email is not a valid email address',
  }),
});

export const createUserZ = userZ.extend({
  password: reqString('Password'),
});
