import {
  instance,
  endpoints,
  createErrorHandler,
  parseResponseData,
} from '../api';

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
