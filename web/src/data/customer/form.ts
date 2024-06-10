import { z } from 'zod';
import { reqString, isReq } from '../form';
import { Customer, CustomerType } from '@data/customer/types';

export const initCustomer = {} as Partial<Customer>;

const customerBaseZ = z.object({
  customerType: z.nativeEnum(CustomerType, isReq('Customer type')),
  firstName: reqString('First name'),
  lastName: reqString('Last name'),
  phoneNumber: reqString('Phone number'),
  email: reqString('Email').email({
    message: 'The email is not a valid email address',
  }),
  address: reqString('Address'),
});

export const customerZ = z.discriminatedUnion(
  'customerType',
  [
    customerBaseZ.extend({
      customerType: z.literal(CustomerType.ORG),
      organizationName: reqString('Organization number'),
    }),
    customerBaseZ.extend({
      customerType: z.literal(CustomerType.PERSON),
      personalIdentityNumber: z
        .string(isReq('Personal identification number'))
        .or(z.null())
        .refine((data) => !data || data.length === 10, {
          message: 'Personal identification number must be 10 digits',
        })
        .refine((data) => !data || /^\d+$/.test(data), {
          message: 'Personal identification number can only contain digits',
        }),
    }),
  ],
  isReq('Customer type'),
);
