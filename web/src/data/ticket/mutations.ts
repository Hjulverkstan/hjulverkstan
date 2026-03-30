import { useMutation } from '@tanstack/react-query';

import { invalidateQueries } from '../queries';
import { createGetCustomers } from '../customer/api';
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
    onSuccess: () =>
      invalidateQueries([
        api.createGetTickets().queryKey,
        createGetCustomers().queryKey,
      ]),
  });

export const useUpdateTicketStatusM = () =>
  useMutation({
    ...api.createUpdateTicketStatus(),
    onSuccess: (_, { id }) =>
      invalidateQueries([
        api.createGetTickets().queryKey,
        api.createGetTicket({ id }).queryKey,
      ]),
  });
