import { z } from 'zod';
import { reqString, isReq } from '../form';
import { Employee } from '@data/employee/types';

export const initEmployee = {} as Partial<Employee>;

export const employeeZ = z.object({
  firstName: reqString('First name'),
  lastName: reqString('Last name'),
  phoneNumber: reqString('Phone number'),
  email: reqString('Email').email({
    message: 'The email is not a valid email address',
  }),
  personalIdentityNumber: z
    .string(isReq('Personal identification number'))
    .refine((data) => data.length === 10, {
      message: 'Personal identification number must be 10 digits',
    })
    .refine((data) => /^\d+$/.test(data), {
      message: 'Personal identification number can only contain digits',
    }),
});
