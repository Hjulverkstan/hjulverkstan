import { Compass, Package, Wrench } from 'lucide-react';

import { createFindFn, createMatchFn } from '../enums';
import { TicketType } from './types';

//

export const type = [
  { dataKey: 'type', value: TicketType.RENT, name: 'Rent', icon: Compass },
  { dataKey: 'type', value: TicketType.REPAIR, name: 'Repair', icon: Wrench },
  { dataKey: 'type', value: TicketType.DONATE, name: 'Donate', icon: Package },
];

//

const all = [...type];

export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
