import { Auditable } from '../types';

export enum CustomerType {
  PERSON = 'PERSON',
  ORG = 'ORGANIZATION',
}

export interface Customer extends Auditable {
  id: string;
  customerType: CustomerType;
  firstName: string;
  lastName: string;
  personalIdentityNumber?: string;
  phoneNumber: string;
  email: string;
  ticketIds: string[];
  comment?: string;
  //
  organizationName?: string;
}

export interface AggregatedCustomer extends Customer {
  age?: number;
}
