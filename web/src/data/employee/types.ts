export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  personalIdentityNumber?: string;
  ticketIds: string[];
  comment?: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
