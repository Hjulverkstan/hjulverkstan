import { Warning } from './types';
import { AlertTriangle } from 'lucide-react';
import { createFindFn, createMatchFn } from '../enums';

export const warningEnums = [
  {
    dataKey: 'warning',
    value: Warning.DUE_PICKUP,
    label: 'Due pickup',
    tooltip: 'Bike ready, waiting for pickup',
    icon: AlertTriangle,
    variant: 'red' as 'red',
  },
  {
    dataKey: 'warning',
    value: Warning.DUE_RETURN,
    label: 'Due return',
    tooltip: 'Bike still out past return date.',
    icon: AlertTriangle,
    variant: 'red' as 'red',
  },
  {
    dataKey: 'warning',
    value: Warning.ORPHAN,
    label: 'Orphan',
    tooltip: 'Bike orphaned: missing ticket.',
    icon: AlertTriangle,
    variant: 'red' as 'red',
  },
];

export const all = warningEnums;
export const find = createFindFn(all);
export const matchFn = createMatchFn(all);
