import { useQuery } from 'react-query';

import * as U from '@utils';
import { useVehiclesQ } from '@data/vehicle/queries';
import { useAggregatedQueries } from '@hooks/useAggregatedQueries';

import { ErrorRes } from '../api';
import { Ticket, TicketAggregated } from './types';
import * as api from './api';

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
      tickets.map((ticket) => ({
        ...ticket,
        locationIds: U.uniq(
          ticket.vehicleIds.map(
            (vehicleId) =>
              vehicles.find((vehicle) => vehicle.id === vehicleId)!.locationId,
          ),
        ),
      })),
    [useTicketsQ(), useVehiclesQ()],
  );
