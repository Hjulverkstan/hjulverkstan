import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';

import { Ticket, TicketStatus, TicketType } from './types';

//

export interface GetTicketsRes {
  tickets: Ticket[];
}

export const createGetTickets = () => ({
  queryKey: ['tickets'],
  queryFn: () =>
    instance
      .get<GetTicketsRes>(endpoints.ticket)
      .then(
        (res) => res.data.tickets.map(parseResponseData).reverse() as Ticket[],
      )
      .catch(createErrorHandler(endpoints.ticket)),
});

export type GetTicketRes = Ticket;
export interface GetTicketParams {
  id: string;
}

export const createGetTicket = ({ id }: GetTicketParams) => ({
  queryKey: ['ticket', id],
  queryFn: () =>
    instance
      .get<GetTicketRes>(`${endpoints.ticket}/${id}`)
      .then((res) => parseResponseData(res.data) as Ticket)
      .catch(createErrorHandler(endpoints.ticket)),
});

// MUTATIONS

const transformBody = ({
  id,
  ticketType,
  ticketStatus,
  startDate,
  endDate,
  repairDescription,
  comment,
  vehicleIds,
  employeeId,
  customerId,
}: Partial<Ticket>) => ({
  id,
  ticketType,
  ticketStatus:
    ticketType === TicketType.DONATE || ticketType === TicketType.RECEIVE
      ? null
      : ticketStatus,
  startDate,
  endDate,
  comment: comment ?? null,
  repairDescription,
  vehicleIds,
  employeeId,
  customerId,
});

const toTicketUrl = (ticketType: string, ticketId?: string) =>
  endpoints.ticket +
  ({
    [TicketType.RENT]: '/rent',
    [TicketType.REPAIR]: '/repair',
    [TicketType.DONATE]: '/donate',
    [TicketType.RECEIVE]: '/receive',
  }[ticketType] ?? '') +
  (ticketId ? `/${ticketId}` : '');

//

export type CreateTicketRes = Ticket;
export type CreateTicketParams = Omit<Ticket, 'id'>;

export const createCreateTicket = () => ({
  mutationFn: (body: CreateTicketParams) =>
    instance
      .post<CreateTicketRes>(toTicketUrl(body.ticketType), transformBody(body))
      .then((res) => parseResponseData(res.data) as Ticket)
      .catch(createErrorHandler(endpoints.ticket)),
});

//

export type EditTicketRes = Ticket;
export type EditTicketParams = Ticket;

export const createEditTicket = () => ({
  mutationFn: (body: EditTicketParams) =>
    instance
      .put<EditTicketRes>(
        toTicketUrl(body.ticketType, body.id),
        transformBody(body),
      )
      .then((res) => parseResponseData(res.data) as Ticket)
      .catch(createErrorHandler(endpoints.ticket)),
});

//

export const createDeleteTicket = () => ({
  mutationFn: (id: string) =>
    instance
      .delete<GetTicketRes>(`${endpoints.ticket}/${id}`)
      .then((res) => parseResponseData(res.data) as Ticket)
      .catch(createErrorHandler(endpoints.ticket)),
});

export const createUpdateTicketStatus = () => ({
  mutationFn: ({
    id,
    ticketStatus,
  }: {
    id: string;
    ticketStatus: TicketStatus;
  }) =>
    instance
      .put<Ticket>(`${endpoints.ticket}/${id}/status`, { ticketStatus })
      .then((res) => parseResponseData(res.data) as Ticket)
      .catch(createErrorHandler(`${endpoints.ticket}/${id}/status`)),
});
