import { Package, ReceiptText, Wrench } from 'lucide-react';

import { createFindFn, createMatchFn } from '../enums';
import { TicketType } from './types';

//

export const type = [
  {
    dataKey: 'ticketType',
    value: TicketType.RENT,
    name: 'Rent',
    icon: ReceiptText,
  },
  {
    dataKey: 'ticketType',
    value: TicketType.REPAIR,
    name: 'Repair',
    icon: Wrench,
  },
  {
    dataKey: 'ticketType',
    value: TicketType.DONATE,
    name: 'Donate',
    icon: Package,
  },
];

//

const all = [...type];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
