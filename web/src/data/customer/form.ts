import { z } from 'zod';

import { Customer, CustomerType } from '@data/customer/types';

import { isReq, phoneNumberZ, reqString, swedishPIN } from '../form';

export const initCustomer = {
  customerType: CustomerType.PERSON,
} as Partial<Customer>;

const customerBaseZ = z.object({
  customerType: z.nativeEnum(CustomerType, isReq('Customer type')),
  firstName: reqString('First name'),
  lastName: reqString('Last name').optional(),
  phoneNumber: phoneNumberZ,
  email: z
    .string()
    .email({ message: 'Email is not valid' })
    .or(z.literal(''))
    .optional(),
});

export const customerZ = z.discriminatedUnion('customerType', [
  customerBaseZ.extend({
    customerType: z.literal(CustomerType.ORG),
    organizationName: reqString('Organization number'),
  }),
  customerBaseZ.extend({
    customerType: z.literal(CustomerType.PERSON),
    personalIdentityNumber: swedishPIN,
  }),
]);
