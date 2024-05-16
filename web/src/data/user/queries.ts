import { useQuery } from '@tanstack/react-query';

import { ErrorRes } from '../api';
import * as api from './api';
import { User } from './types';

//

export const useUsersQ = () => useQuery<User[], ErrorRes>(api.createGetUsers());

export interface UseUserQProps {
  id: string;
}

export const useUserQ = ({ id }: UseUserQProps) =>
  useQuery<User, ErrorRes>({
    ...api.createGetUser({ id }),
    enabled: !!id,
  });
