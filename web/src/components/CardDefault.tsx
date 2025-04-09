import React from 'react';
import { ArrowRight, LucideIcon } from 'lucide-react';

import { Base, Body, CardBaseProps, Icon, Title } from '@components/Card';
import { IconLink, LinkProps } from '@components/shadcn/Button';

interface CardDefaultProps {
  variant?: CardBaseProps['variant'];
  icon: LucideIcon;
  title: string;
  body: string;
  link: LinkProps['to'];
  ariaLabel?: string;
  linkLabel?: string;
  className?: string;
}

export const CardDefault: React.FC<CardDefaultProps> = ({
  icon,
  title,
  body,
  link,
  ariaLabel,
  linkLabel,
  variant,
  className,
}) => (
  <Base variant={variant} className={className}>
    <Icon icon={icon} />
    <Title className="pb-4 pt-6">{title}</Title>
    <Body>{body}</Body>
    <div className="mt-auto flex justify-end pt-6">
      <IconLink
        to={link}
        variant="contrast"
        subVariant="rounded"
        size="large"
        icon={ArrowRight}
        text={linkLabel}
        aria-label={ariaLabel ?? 'Read more'}
        iconRight
      />
    </div>
  </Base>
);
