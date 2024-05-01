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
  organizationName?: string;
  phoneNumber: string;
  email: string;
  ticketIds: string[];
  comment?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
