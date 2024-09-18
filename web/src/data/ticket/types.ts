export enum TicketType {
  RENT = 'RENT',
  REPAIR = 'REPAIR',
  DONATE = 'DONATE',
}

export interface Ticket {
  id: string;
  ticketType: TicketType;
  ticketStatus: TicketStatus;
  startDate: string;
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
  ticketStatus: TicketStatus;
  daysLeft?: number;
}
