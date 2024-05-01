import { useQuery } from 'react-query';

import { ErrorRes } from '../api';
import { Customer } from './types';
import * as api from './api';

//

export const useCustomersQ = () =>
  useQuery<Customer[], ErrorRes>(api.createGetCustomers());
