import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from './index';

export enum TicketType {
  RENT = 'RENT',
  REPAIR = 'REPAIR',
  DONATE = 'DONATE',
}

export interface Ticket {
  id: string;
  ticketType: TicketType;
  isOpen: boolean;
  startDate: string;
  endDate: string;
  comment: string | null;
  vehicleIds: string[];
  employeeId: string;
  customerId: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

//

export interface GetTicketsRes {
  tickets: Ticket[];
}

export const createGetTickets = () => ({
  queryKey: ['tickets'],
  queryFn: () =>
    instance
      .get<GetTicketsRes>(endpoints.ticket)
      .then((res) => res.data.tickets.map(parseResponseData) as Ticket[])
      .catch(createErrorHandler(endpoints.ticket)),
});
