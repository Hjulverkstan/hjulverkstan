import { AlertTriangle, SendIcon } from 'lucide-react';
import { EnumAttributesRaw } from '../types';
import { Warning } from './types';

export const warningEnums: EnumAttributesRaw[] = [
  {
    dataKey: 'warning',
    value: Warning.DUE_PICKUP,
    translationKey: 'enumWarningDuePickupLabel',
    tooltipTranslationKey: 'enumWarningDuePickupTooltip',
    icon: AlertTriangle,
    variant: 'red' as 'red',
  },
  {
    dataKey: 'warning',
    value: Warning.DUE_RETURN,
    translationKey: 'enumWarningDueReturnLabel',
    tooltipTranslationKey: 'enumWarningDueReturnTooltip',
    icon: AlertTriangle,
    variant: 'red' as 'red',
  },
  {
    dataKey: 'warning',
    value: Warning.ORPHAN,
    translationKey: 'enumWarningOrphanLabel',
    tooltipTranslationKey: 'enumWarningOrphanTooltip',
    icon: AlertTriangle,
    variant: 'red' as 'red',
  },
  {
    dataKey: 'warning',
    value: Warning.REPAIR_NOTIFICATION_FAILED,
    translationKey: 'enumWarningRepairNotificationFailedLabel',
    tooltipTranslationKey: 'enumWarningRepairNotificationFailedTooltip',
    icon: SendIcon,
    variant: 'red' as 'red',
  },
];
