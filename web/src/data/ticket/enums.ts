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

export const ticketStatus = [
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.READY,
    label: 'Ready',
    icon: CheckCircle,
    variant: 'destructive' as 'destructive',
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.IN_PROGRESS,
    label: 'In progress',
    icon: RefreshCw,
    variant: 'success' as 'successOutline',
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.COMPLETE,
    label: 'Complete',
    icon: Check,
    variant: 'outline' as 'outline',
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.CLOSED,
    label: 'Closed',
    icon: XCircle,
    variant: 'outline' as 'outline',
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
