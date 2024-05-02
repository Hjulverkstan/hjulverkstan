import { Badge as BadgeComp, BadgeProps } from './shadcn/Badge';
import { ComponentType } from 'react';

export interface Badge {
  href?: string;
  icon?: ComponentType<any>;
  variant?: BadgeProps['variant'];
  label: string;
}

export interface BadgeGroupProps {
  badges: Badge[];
  limit?: number;
}

export default function BadgeGroup({ badges, limit = 2 }: BadgeGroupProps) {
  const limitedBadges =
    badges.length >= limit + 1
      ? badges.slice(0, limit).concat({
          label: `${badges.length - limit} more ...`,
          variant: 'outline',
        })
      : badges;

  return (
    <div className="flex gap-2">
      {limitedBadges.map(({ icon: Icon, label, variant = 'secondary' }, i) => (
        <BadgeComp
          key={i}
          variant={variant}
          className="flex items-center justify-start gap-1"
        >
          {Icon && <Icon className="ml--1 h-3.5 w-3.5" />} {label}
        </BadgeComp>
      ))}
    </div>
  );
}
