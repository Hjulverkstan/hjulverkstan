import {
  Calendar,
  CheckCircle,
  CircleDot,
  Package,
  ReceiptText,
  Wrench,
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
    icon: Package,
  },
];

export const status = [
  {
    dataKey: 'status',
    value: TicketStatus.DUE,
    label: 'Due',
    icon: Calendar,
    variant: 'destructive' as 'destructive',
  },
  {
    dataKey: 'status',
    value: TicketStatus.OPEN,
    label: 'Open',
    icon: CircleDot,
    variant: 'success' as 'successOutline',
  },
  {
    dataKey: 'status',
    value: TicketStatus.CLOSED,
    label: 'Closed',
    icon: CheckCircle,
    variant: 'outline' as 'outline',
  },
];

//

const all = [...ticketType, ...status];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
