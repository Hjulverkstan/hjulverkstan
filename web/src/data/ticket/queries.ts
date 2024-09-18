import { useQuery } from '@tanstack/react-query';

import { useVehiclesQ } from '@data/vehicle/queries';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';
import * as U from '@utils';

import { useMemo } from 'react';
import { ErrorRes } from '../api';
import * as api from './api';
import * as enums from './enums';
import { Ticket, TicketAggregated, TicketStatus } from './types';

//

export const useTicketsQ = () =>
  useQuery<Ticket[], ErrorRes>(api.createGetTickets());

//

export interface UseTicketQProps {
  id: string;
}

export const useTicketQ = ({ id }: UseTicketQProps) =>
  useQuery<Ticket, ErrorRes>({ ...api.createGetTicket({ id }), enabled: !!id });

//

export const useTicketsAggregatedQ = () =>
  useAggregatedQueries(
    (tickets, vehicles): TicketAggregated[] =>
      tickets.map((ticket) => {
        return {
          ...ticket,
          status: ticket.ticketStatus,
          locationIds: U.uniq(
            ticket.vehicleIds.map(
              (vehicleId) =>
                vehicles.find((vehicle) => vehicle.id === vehicleId)!
                  .locationId,
            ),
          ),
        };
      }),
    [useTicketsQ(), useVehiclesQ()],
  );

//

export const useTicketsAsEnumsQ = ({ dataKey = 'ticketId' } = {}) => {
  const query = useTicketsAggregatedQ();

  return useMemo(
    () => ({
      ...query,
      data:
        query.data?.map((ticket) => ({
          dataKey,
          icon: enums.find(ticket.ticketType).icon,
          label: `#${ticket.id}`,
          variant: {
            [TicketStatus.CLOSED]: 'outline',
            [TicketStatus.IN_PROGRESS]: 'success',
            [TicketStatus.READY]: 'warn',
            [TicketStatus.COMPLETE]: 'success',
          }[ticket.ticketStatus] as 'outline' | 'warn' | 'success',
          value: ticket.id,
        })) ?? [],
    }),
    [query.data],
  );
};
