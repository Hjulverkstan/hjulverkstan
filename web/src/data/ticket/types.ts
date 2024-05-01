export enum TicketType {
  RENT = 'RENT',
  REPAIR = 'REPAIR',
  DONATE = 'DONATE',
}

export interface Ticket {
  id: string;
  ticketType: TicketType;
  isOpen: boolean;
  startDate: string;
  endDate: string;
  comment: string | null;
  vehicleIds: string[];
  employeeId: string;
  customerId: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}
