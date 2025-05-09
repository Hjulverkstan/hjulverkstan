import {
  Check,
  CheckCircle,
  ReceiptText,
  RefreshCw,
  Wrench,
  XCircle,
  LogOut,
  LogIn,
} from 'lucide-react';

import { createFindFn, createMatchFn } from '../enums';
import { TicketStatus, TicketType } from './types';

//

export const ticketType = [
  {
    dataKey: 'ticketType',
    value: TicketType.RENT,
    label: 'Rent',
    icon: ReceiptText,
  },
  {
    dataKey: 'ticketType',
    value: TicketType.REPAIR,
    label: 'Repair',
    icon: Wrench,
  },
  {
    dataKey: 'ticketType',
    value: TicketType.DONATE,
    label: 'Donate',
    icon: LogOut,
  },
  {
    dataKey: 'ticketType',
    value: TicketType.RECEIVE,
    label: 'Receive',
    icon: LogIn,
  },
];

export enum TicketStatusVariants {
  READY = 'blue',
  IN_PROGRESS = 'yellow',
  COMPLETE = 'purple',
  CLOSED = 'outline',
}

export const ticketStatus = [
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.READY,
    label: 'Ready',
    icon: CheckCircle,
    variant: TicketStatusVariants.READY,
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.IN_PROGRESS,
    label: 'In progress',
    icon: RefreshCw,
    variant: TicketStatusVariants.IN_PROGRESS,
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.COMPLETE,
    label: 'Complete',
    icon: Check,
    variant: TicketStatusVariants.COMPLETE,
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.CLOSED,
    label: 'Closed',
    icon: XCircle,
    variant: TicketStatusVariants.CLOSED,
  },
];

export const ticketEnums = {
  ticketType,
  ticketStatus,
};

//

const all = [...ticketType, ...ticketStatus];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
