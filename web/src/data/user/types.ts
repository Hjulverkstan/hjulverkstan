import { AuthRole } from '@data/auth/types';

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  roles: AuthRole[];
  //
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
