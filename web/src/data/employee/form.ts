import { z } from 'zod';

import { Employee } from '@data/employee/types';

import { swedishPIN, reqString } from '../form';

export const initEmployee = {} as Partial<Employee>;

export const employeeZ = z.object({
  firstName: reqString('First name'),
  lastName: reqString('Last name'),
  phoneNumber: reqString('Phone number'),
  email: reqString('Email').email({
    message: 'The email is not a valid email address',
  }),
  personalIdentityNumber: swedishPIN,
});
