import { useQuery } from 'react-query';

import { ErrorRes } from '../api';
import { Ticket } from './types';
import * as api from './api';

//

export const useTicketsQ = () =>
  useQuery<Ticket[], ErrorRes>(api.createGetTickets());
