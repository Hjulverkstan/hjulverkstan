import React from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@utils/common';
import { IconLink, LinkProps } from '@components/shadcn/Button';
import { Base, Body, Row, Title } from '@components/Card';

interface CardCompactProps {
  title: string;
  body: string;
  link: LinkProps['to'];
  ariaLabel: string;
  className?: string;
}

export const CardCompact: React.FC<CardCompactProps> = ({
  title,
  body,
  link,
  ariaLabel,
  className,
}) => (
  <Base variant="compact" className={cn('flex flex-col', className)}>
    <Title className="text-h3 mb-4 line-clamp-1">{title}</Title>
    <Row className="items-end">
      <Body className="line-clamp-2">{body}</Body>
      <IconLink
        to={link}
        variant="mutedSharp"
        subVariant="rounded"
        size="large"
        icon={ArrowRight}
        className="ml-auto"
        aria-label={ariaLabel}
      />
    </Row>
  </Base>
);
