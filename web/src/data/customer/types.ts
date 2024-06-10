export enum CustomerType {
  PERSON = 'PERSON',
  ORG = 'ORGANIZATION',
}

export interface Customer {
  id: string;
  customerType: CustomerType;
  firstName: string;
  lastName: string;
  personalIdentityNumber: string;
  phoneNumber: string;
  email: string;
  ticketIds: string[];
  address: string;
  comment?: string;
  //
  organizationName?: string;
  //
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
