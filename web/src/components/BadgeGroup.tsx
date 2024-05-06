import { ComponentType, Fragment } from 'react';

import * as Tooltip from '@components/shadcn/Tooltip';
import { Badge as BadgeComp, BadgeProps } from '@components/shadcn/Badge';
import { Link } from 'react-router-dom';

export interface Badge {
  label: string;
  href?: string;
  icon?: ComponentType<any>;
  variant?: BadgeProps['variant'];
  tooltip?: JSX.Element | string;
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
      {limitedBadges.map(
        ({ icon: Icon, label, href, tooltip, variant = 'secondary' }, i) => {
          let content = (
            <BadgeComp
              variant={variant}
              className="flex items-center justify-start gap-1"
            >
              {Icon && <Icon className="ml--1 h-3.5 w-3.5" />} {label}
            </BadgeComp>
          );

          if (href) {
            content = (
              <Link onClick={(e) => e.stopPropagation()} to={href}>
                {content}
              </Link>
            );
          }

          if (tooltip) {
            content = (
              <Tooltip.Root key={label} disableHoverableContent={!tooltip}>
                <Tooltip.Trigger asChild>{content}</Tooltip.Trigger>
                <Tooltip.Content>{tooltip}</Tooltip.Content>
              </Tooltip.Root>
            );
          }

          return <Fragment key={i}>{content}</Fragment>;
        },
      )}
    </div>
  );
}
