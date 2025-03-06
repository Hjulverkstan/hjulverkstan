import { Warning } from './types';
import { AlertTriangle } from 'lucide-react';
import { createFindFn, createMatchFn } from '../enums';

export const warningEnums = [
  {
    dataKey: 'warning',
    value: Warning.DUE_PICKUP,
    label: 'Bike pickup overdue',
    tooltip: 'Bike pickup overdue: please collect.',
    icon: AlertTriangle,
    variant: 'destructive',
  },
  {
    dataKey: 'warning',
    value: Warning.DUE_RETURN,
    label: 'Bike return overdue',
    tooltip: 'Bike return overdue: not yet returned.',
    icon: AlertTriangle,
    variant: 'destructive',
  },
  {
    dataKey: 'warning',
    value: Warning.ORPHAN,
    label: 'Cycle orphaned',
    tooltip: 'Bike orphaned: missing ticket.',
    icon: AlertTriangle,
    variant: 'destructive',
  },
];

export const all = warningEnums;
export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
