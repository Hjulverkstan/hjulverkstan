export enum CustomerType {
  PERSON = 'PERSON',
  ORG = 'ORGANIZATION',
}

export interface Customer {
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
  //
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface AggregatedCustomer extends Customer {
  age?: number;
}
