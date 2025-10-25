import { AuthRole } from '../auth/types';
import { Auditable } from '../types';

export interface User extends Auditable {
  id: string;
  username: string;
  email: string;
  password?: string;
  roles: AuthRole[];
}
