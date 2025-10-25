import { Auditable } from '../types';

export interface Employee extends Auditable {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  personalIdentityNumber?: string;
  ticketIds: string[];
  comment?: string;
}
