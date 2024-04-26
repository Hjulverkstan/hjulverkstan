import { LucideIcon } from 'lucide-react';

import { Badge as BadgeComp, BadgeProps } from './shadcn/Badge';

export interface Badge {
  href?: string;
  icon?: LucideIcon;
  variant?: BadgeProps['variant'];
  label: string;
}

export interface BadgeGroupProps {
  badges: Badge[];
}

export default function BadgeGroup({ badges }: BadgeGroupProps) {
  return (
    <div className="flex gap-2">
      {badges.map(({ icon: Icon, label, variant = 'secondary' }, i) => (
        <BadgeComp
          key={i}
          variant={variant}
          className="flex items-center justify-start gap-1"
        >
          {Icon && <Icon size="14" className="ml--1" />} {label}
        </BadgeComp>
      ))}
    </div>
  );
}
