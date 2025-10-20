import { ArrowRight, LucideIcon } from 'lucide-react';
import React from 'react';

import { Base, Body, CardBaseProps, Icon, Title } from '@components/Card';
import { buttonVariants, IconLink, LinkProps } from '@components/shadcn/Button';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@utils/common';

interface CardDefaultProps {
  variant?: CardBaseProps['variant'];
  icon?: LucideIcon;
  title: string;
  body: React.ReactNode;
  link?: LinkProps['to'];
  ariaLabel?: string;
  linkLabel?: string;
  className?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  onClick?: React.MouseEventHandler;
  preventNavigation?: boolean;
}

export const CardDefault: React.FC<CardDefaultProps> = ({
  icon,
  title,
  body,
  link = '#',
  ariaLabel,
  linkLabel,
  variant,
  className,
  buttonVariant = 'contrast',
  onClick,
}) => {
  return (
    <Base variant={variant} className={className}>
      {icon && <Icon icon={icon} />}
      <Title className="pb-4 pt-6">{title}</Title>
      <Body>{body}</Body>

      <div className={cn('mt-auto flex justify-end pt-6')}>
        <IconLink
          to={link ?? '#'}
          variant={buttonVariant}
          subVariant="rounded"
          size="large"
          icon={ArrowRight}
          text={linkLabel}
          aria-label={ariaLabel ?? 'Read more'}
          iconRight
          onClick={onClick}
        />
      </div>
    </Base>
  );
};
