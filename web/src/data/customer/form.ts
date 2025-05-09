import { z } from 'zod';

import { Customer, CustomerType } from '@data/customer/types';

import { reqString, isReq, swedishPIN } from '../form';

export const initCustomer = {} as Partial<Customer>;

const customerBaseZ = z.object({
  customerType: z.nativeEnum(CustomerType, isReq('Customer type')),
  firstName: reqString('First name'),
  lastName: reqString('Last name'),
  phoneNumber: reqString('Phone number'),
  email: reqString('Email').email({
    message: 'The email is not a valid email address',
  }),
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
