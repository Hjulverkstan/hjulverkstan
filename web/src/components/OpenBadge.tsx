import React from 'react';

import { Badge } from '@components/shadcn/Badge';
import { cn } from '@utils';
import { useShopOpenStatus } from '@hooks/useShopOpenData';
import type { OpenHours } from '@data/webedit/shop/types';

interface OpenBadgeProps {
  openHours?: OpenHours | undefined | null;
  className?: string;
  variant?: 'large' | 'badge' | 'minimal';
}

export const OpenBadge: React.FC<OpenBadgeProps> = ({
  openHours,
  className,
  variant = 'badge',
}) => {
  const isOpen = useShopOpenStatus(openHours);

  if (openHours === undefined || openHours === null) return null;

  const Icon = () => (
    <span
      className={cn(
        'mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full',
        isOpen ? 'bg-success-accent' : 'bg-warn-accent',
      )}
      aria-hidden="true"
    />
  );

  return (
    <Badge
      variant={isOpen ? 'successMuted' : 'warnMuted'}
      borderless={true}
      icon={Icon}
      className={cn(
        variant === 'large' && 'text-body',
        variant === 'minimal' && 'bg-secondary p-0 text-base',
        className,
      )}
    >
      {isOpen ? 'Open' : 'Closed'}
    </Badge>
  );
};
