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

import { EnumAttributesRaw } from '../types';
import { TicketStatus, TicketType } from './types';

export const ticketType: EnumAttributesRaw[] = [
  {
    dataKey: 'ticketType',
    value: TicketType.RENT,
    translationKey: 'enumTicketTypeRent',
    icon: ReceiptText,
  },
  {
    dataKey: 'ticketType',
    value: TicketType.REPAIR,
    translationKey: 'enumTicketTypeRepair',
    icon: Wrench,
  },
  {
    dataKey: 'ticketType',
    value: TicketType.DONATE,
    translationKey: 'enumTicketTypeDonate',
    icon: LogOut,
  },
  {
    dataKey: 'ticketType',
    value: TicketType.RECEIVE,
    translationKey: 'enumTicketTypeReceive',
    icon: LogIn,
  },
];

export const ticketStatus: EnumAttributesRaw[] = [
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.READY,
    translationKey: 'enumTicketStatusReady',
    icon: CheckCircle,
    variant: 'blue' as 'blue',
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.IN_PROGRESS,
    translationKey: 'enumTicketStatusInProgress',
    icon: RefreshCw,
    variant: 'yellow' as 'yellow',
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.COMPLETE,
    translationKey: 'enumTicketStatusComplete',
    icon: Check,
    variant: 'purple' as 'purple',
  },
  {
    dataKey: 'ticketStatus',
    value: TicketStatus.CLOSED,
    translationKey: 'enumTicketStatusClosed',
    icon: XCircle,
    variant: 'outline' as 'outline',
  },
];
