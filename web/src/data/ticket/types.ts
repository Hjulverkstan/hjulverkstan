export enum TicketType {
  RENT = 'RENT',
  REPAIR = 'REPAIR',
  DONATE = 'DONATE',
}

export interface Ticket {
  id: string;
  ticketType: TicketType;
  startDate: string;
  comment: string | null;
  vehicleIds: string[];
  employeeId: string;
  customerId: string;
  //
  endDate?: string;
  isOpen?: boolean;
  repairDescription?: string;
  //
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface TicketAggregated extends Ticket {
  locationIds: string[];
}
