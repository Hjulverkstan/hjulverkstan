import { useQuery } from '@tanstack/react-query';

import { useVehiclesQ } from '@data/vehicle/queries';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';
import * as U from '@utils';
import { EnumAttributes } from '../enums';
import { ErrorRes } from '../api';
import * as api from './api';
import * as enums from './enums';
import { Ticket, TicketAggregated, TicketStatus } from './types';
import { differenceInDays } from 'date-fns';

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
        const daysLeft = ticket.endDate
          ? differenceInDays(new Date(ticket.endDate), new Date())
          : undefined;

        const daysSinceUpdate = ticket.statusUpdatedAt
          ? differenceInDays(new Date(), new Date(ticket.statusUpdatedAt))
          : undefined;

        return {
          ...ticket,
          daysLeft,
          daysSinceUpdate,
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

export const useTicketsAsEnumsQ = ({ dataKey = 'ticketId' } = {}) =>
  useQuery<Ticket[], ErrorRes, EnumAttributes[]>({
    ...api.createGetTickets(),
    select: (tickets): EnumAttributes[] =>
      tickets?.map((ticket) => ({
        dataKey,
        icon: enums.find(ticket.ticketType).icon,
        label: `#${ticket.id}`,
        value: ticket.id,
        ...(ticket.ticketStatus && {
          variant: {
            [TicketStatus.CLOSED]: 'outline',
            [TicketStatus.IN_PROGRESS]: 'success',
            [TicketStatus.READY]: 'warn',
            [TicketStatus.COMPLETE]: 'success',
          }[ticket.ticketStatus] as EnumAttributes['variant'],
        }),
      })) ?? [],
  });
