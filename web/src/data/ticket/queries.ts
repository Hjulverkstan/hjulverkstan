import { useQuery } from '@tanstack/react-query';

import { useVehiclesQ } from '@data/vehicle/queries';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';
import * as C from '@utils/common';
import { StandardError } from '../api';
import { EnumAttributes } from '../types';
import * as api from './api';
import * as enumsRaw from './enums';
import { Ticket, TicketAggregated, TicketStatus } from './types';
import { Warning } from '@data/warning/types';
import { differenceInDays } from 'date-fns';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import { findEnum } from '@utils/enums';

//

interface UseTicketsQProps {
  ticketIds?: string[];
}

export const useTicketsQ = ({ ticketIds }: UseTicketsQProps = {}) =>
  useQuery<Ticket[], StandardError>({
    ...api.createGetTickets(),
    select: ticketIds
      ? (tickets) => tickets.filter((t) => ticketIds.includes(t.id))
      : (x) => x,
  });

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
          locationIds: C.uniq(
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

export const useTicketsAsEnumsQ = ({ dataKey = 'ticketId' } = {}) => {
  const enums = useTranslateRawEnums(enumsRaw);

  return useQuery<Ticket[], StandardError, EnumAttributes[]>({
    ...api.createGetTickets(),
    select: (tickets) =>
      tickets?.map((ticket) => ({
        dataKey,
        icon: findEnum(enums, ticket.ticketType).icon,
        label: `#${ticket.id}`,
        value: ticket.id,
        ...(ticket.ticketStatus && {
          variant: {
            [TicketStatus.CLOSED]: 'outline',
            [TicketStatus.IN_PROGRESS]: 'yellow',
            [TicketStatus.READY]: 'blue',
            [TicketStatus.COMPLETE]: 'purple',
          }[ticket.ticketStatus] as EnumAttributes['variant'],
        }),
      })) ?? [],
  });
};
