export enum TicketType {
  RENT = 'RENT',
  REPAIR = 'REPAIR',
  DONATE = 'DONATE',
  RECEIVE = 'RECEIVE',
}

export interface Ticket {
  id: string;
  ticketType: TicketType;
  ticketStatus?: TicketStatus;
  startDate: string | undefined;
  comment: string | null;
  vehicleIds: string[];
  employeeId: string;
  customerId: string;
  //
  endDate?: string;
  repairDescription?: string;
  //
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  statusUpdatedAt?: string;
}

//

export enum TicketStatus {
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETE = 'COMPLETE',
  CLOSED = 'CLOSED',
}

export interface TicketAggregated extends Ticket {
  locationIds: string[];
  daysLeft?: number;
  daysSinceUpdate?: number;
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
