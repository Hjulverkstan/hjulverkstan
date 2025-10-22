import React, { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@utils';
import { IconLink, LinkProps } from '@components/shadcn/Button';
import { Base, Body, Row, Title } from '@components/Card';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

interface CardCompactProps {
  title: string;
  body: ReactNode;
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
}) => {
  const { currLocale } = usePreloadedDataLocalized();

  return (
    <Base variant="compact" className={cn('flex flex-col', className)}>
      <Title className="text-h3 mb-4 line-clamp-1">{title}</Title>
      <Row className="items-end">
        <Body className="line-clamp-2">{body}</Body>
        <IconLink
          to={`/${currLocale}${link}`}
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
};
