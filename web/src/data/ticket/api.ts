import { createErrorHandler, endpoints, instance } from '../api';

import { Ticket, TicketStatus } from './types';

// GET ALL

export interface GetTicketsRes {
  tickets: Ticket[];
}

export const createGetTickets = () => ({
  queryKey: [endpoints.ticket],
  queryFn: () =>
    instance
      .get<GetTicketsRes>(endpoints.ticket)
      .then((res) => res.data.tickets)
      .catch(createErrorHandler(endpoints.ticket)),
});

// GET

export type GetTicketRes = Ticket;
export interface GetTicketParams {
  id: string;
}

export const createGetTicket = ({ id }: GetTicketParams) => ({
  queryKey: [endpoints.ticket, id],
  queryFn: () =>
    instance
      .get<GetTicketRes>(`${endpoints.ticket}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.ticket)),
});

// CREATE

export type CreateTicketRes = Ticket;
export type CreateTicketParams = Omit<Ticket, 'id'>;

export const createCreateTicket = () => ({
  mutationFn: (body: CreateTicketParams) =>
    instance
      .post<CreateTicketRes>(endpoints.ticket, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.ticket)),
});

// EDIT

export type EditTicketRes = Ticket;
export type EditTicketParams = Ticket;

export const createEditTicket = () => ({
  mutationFn: ({ id, ...body }: EditTicketParams) =>
    instance
      .put<EditTicketRes>(`${endpoints.ticket}/${id}`, body)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.ticket)),
});

// EDIT STATUS

export type EditStatusRes = Ticket;
export interface EditStatusParams {
  id: string;
  ticketStatus: TicketStatus;
}

export const createUpdateTicketStatus = () => ({
  mutationFn: ({ id, ticketStatus }: EditStatusParams) =>
    instance
      .put<EditStatusRes>(`${endpoints.ticket}/${id}/status`, { ticketStatus })
      .then((res) => res.data)
      .catch(createErrorHandler(`${endpoints.ticket}/${id}/status`)),
});

// DELETE

export const createDeleteTicket = () => ({
  mutationFn: (id: string) =>
    instance
      .delete(`${endpoints.ticket}/${id}`)
      .then((res) => res.data)
      .catch(createErrorHandler(endpoints.ticket)),
});
