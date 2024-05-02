import { useMutation } from 'react-query';

import { invalidateQueries } from '../queries';
import * as api from './api';

export const useCreateTicketM = () =>
  useMutation({
    ...api.createCreateTicket(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetTickets().queryKey,
        api.createGetTicket({ id }).queryKey,
      ]),
  });

export const useEditTicketM = () =>
  useMutation({
    ...api.createEditTicket(),
    onSuccess: ({ id }) =>
      invalidateQueries([
        api.createGetTickets().queryKey,
        api.createGetTicket({ id }).queryKey,
      ]),
  });

export const useDeleteTicketM = () =>
  useMutation({
    ...api.createDeleteTicket(),
    onSuccess: () => invalidateQueries([api.createGetTickets().queryKey]),
  });
