import { z } from 'zod';

import { AuthRole } from '@data/auth/types';
import { User } from '@data/user/types';

import { isReq, reqString } from '../form';
import { Mode } from '@components/DataForm';

//

export const initUser = {
  roles: [],
} as Partial<User>;

export const createUserZ = (mode: Mode) =>
  z
    .object({
      roles: z
        .array(z.nativeEnum(AuthRole, isReq('User role is required')))
        .min(1, 'At least one role is required'),
      username: reqString('Username').regex(/^[a-z0-9]+$/, {
        message: 'Only lowercase and numbers are allowed',
      }),

      email: reqString('Email').email({
        message: 'The email is not a valid email address',
      }),
      password:
        mode === Mode.CREATE
          ? reqString('Password').min(3, {
              message: 'Password must be at least 3 characters',
            })
          : z
              .string()
              .min(3, { message: 'Password must be at least 3 characters' })
              .optional(),
      passwordrepeat:
        mode === Mode.CREATE
          ? reqString('Matching password')
          : z.string().optional(),
    })
    .refine((data) => data.password === data.passwordrepeat, {
      message: 'Passwords must match',
    });
