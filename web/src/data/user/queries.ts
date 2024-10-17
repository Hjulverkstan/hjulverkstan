import { useQuery } from '@tanstack/react-query';

import { StandardError } from '../api';
import * as api from './api';
import { User } from './types';

//

export const useUsersQ = () =>
  useQuery<User[], StandardError>(api.createGetUsers());

export interface UseUserQProps {
  id: string;
}

export const useUserQ = ({ id }: UseUserQProps) =>
  useQuery<User, StandardError>({
    ...api.createGetUser({ id }),
    enabled: !!id,
  });
