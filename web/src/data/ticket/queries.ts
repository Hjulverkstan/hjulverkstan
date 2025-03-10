import { useQuery } from '@tanstack/react-query';

import { useVehiclesQ } from '@data/vehicle/queries';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';
import * as U from '@utils';
import { EnumAttributes } from '../enums';
import { StandardError } from '../api';
import * as api from './api';
import * as enums from './enums';
import { Ticket, TicketAggregated, TicketStatus } from './types';
import { Warning } from '@data/warning/types';
import { differenceInDays } from 'date-fns';

//

export const useTicketsQ = () =>
  useQuery<Ticket[], StandardError>(api.createGetTickets());

//

export interface UseTicketQProps {
  id: string;
}

export const useTicketQ = ({ id }: UseTicketQProps) =>
  useQuery<Ticket, StandardError>({
    ...api.createGetTicket({ id }),
    enabled: !!id,
  });

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

        const warnings: Warning[] = [
          ...(ticket.startDate &&
          new Date(ticket.startDate) < new Date() &&
          ticket.ticketStatus === 'READY'
            ? [Warning.DUE_PICKUP]
            : []),
          ...(ticket.endDate &&
          new Date(ticket.endDate) < new Date() &&
          ticket.ticketStatus === 'IN_PROGRESS'
            ? [Warning.DUE_RETURN]
            : []),
        ];

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
          warnings,
        };
      }),
    [useTicketsQ(), useVehiclesQ()],
  );

//

export const useTicketsAsEnumsQ = ({ dataKey = 'ticketId' } = {}) =>
  useQuery<Ticket[], StandardError, EnumAttributes[]>({
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
