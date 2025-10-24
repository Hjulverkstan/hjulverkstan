import { Warning } from '../warning/types';
import { Auditable } from '../types';

export enum TicketType {
  RENT = 'RENT',
  REPAIR = 'REPAIR',
  DONATE = 'DONATE',
  RECEIVE = 'RECEIVE',
}

export interface Ticket extends Auditable {
  id: string;
  ticketType: TicketType;
  ticketStatus?: TicketStatus;
  comment: string | null;
  vehicleIds: string[];
  locationId: string;
  employeeId: string;
  customerId: string;
  statusUpdatedAt?: string;
  //
  startDate?: string;
  endDate?: string;
  repairDescription?: string;
}

//

export enum TicketStatus {
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  CLOSED = 'CLOSED',
}

export interface TicketAggregated extends Ticket {
  daysLeft?: number;
  daysSinceUpdate?: number;
  warnings?: Warning[];
}

// Used to know which ticket status are available on a certain type of ticket

export const ticketTypeTicketStatusMap = {
  [TicketType.DONATE]: undefined,
  [TicketType.REPAIR]: [
    TicketStatus.READY,
    TicketStatus.IN_PROGRESS,
    TicketStatus.COMPLETE,
    TicketStatus.CLOSED,
  ],
  [TicketType.RENT]: [
    TicketStatus.READY,
    TicketStatus.IN_PROGRESS,
    TicketStatus.CLOSED,
  ],
  [TicketType.RECEIVE]: undefined,
};

export const ticketTypeToTicketStatus = (type: TicketType) =>
  ticketTypeTicketStatusMap[type];
