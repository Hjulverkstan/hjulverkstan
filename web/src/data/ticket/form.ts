import { z } from 'zod';
import { isReq, reqString } from '../form';
import { Ticket, TicketType } from '@data/ticket/types';

export const initTicket = {
  vehicleIds: [],
} as Partial<Ticket>;

const ticketBaseZ = z.object({
  ticketType: z.nativeEnum(TicketType, isReq('Ticket type')),
  startDate: z.string(isReq('Start date')),
  vehicleIds: z
    .array(z.string(isReq('Vehicle ids')))
    .min(1, 'At least one vehicle is required'),
  employeeId: z.string(isReq('Employee id')),
  customerId: z.string(isReq('Customer id')),
});

const ticketBaseZSecond = z.object({
  ticketType: z.nativeEnum(TicketType, isReq('Ticket type')),
  vehicleIds: z
    .array(z.string(isReq('Vehicle ids')))
    .min(1, 'At least one vehicle is required'),
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
      repairDescription: reqString('Repair description'),
      endDate: z.string(isReq('End date')),
    }),
    ticketBaseZSecond.extend({
      ticketType: z.literal(TicketType.DONATE),
    }),
    ticketBaseZSecond.extend({
      ticketType: z.literal(TicketType.RECEIVE),
    }),
  ],
  isReq('Ticket type'),
);
