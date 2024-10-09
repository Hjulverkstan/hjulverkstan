import { z } from 'zod';
import { isReq } from '../form';
import { Ticket, TicketType } from '@data/ticket/types';

export const initTicket = {
  vehicleIds: [],
  ticketStatus: 'READY',
} as Partial<Ticket>;

const ticketBaseZ = z.object({
  ticketType: z.nativeEnum(TicketType, isReq('Ticket type')),
  startDate: z.string(isReq('Start date')),
  vehicleIds: z.array(z.string(isReq('Vehicle ids'))),
  employeeId: z.string(isReq('Employee id')),
  customerId: z.string(isReq('Customer id')),
});

export const ticketZ = z.discriminatedUnion(
  'ticketType',
  [
    ticketBaseZ.extend({
      ticketType: z.literal(TicketType.RENT),
      endDate: z.string(isReq('End date')),
    }),
    ticketBaseZ.extend({
      ticketType: z.literal(TicketType.REPAIR),
      repairDescription: z.string(isReq('Repair description')),
      endDate: z.string(isReq('End date')),
    }),
    ticketBaseZ.extend({
      ticketType: z.literal(TicketType.DONATE),
    }),
  ],
  isReq('Ticket type'),
);
