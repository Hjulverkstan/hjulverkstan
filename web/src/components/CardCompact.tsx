import React, { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

import { cn } from '@utils/common';
import { IconLink, LinkProps } from '@components/shadcn/Button';
import { Base, Body, Row, Title } from '@components/Card';

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
}) => (
  <Base
    variant="compact"
    className={cn('flex flex-col rounded-[32px]', className)}
  >
    <Title className="text-h3 mb-4 line-clamp-1">{title}</Title>
    <Row className="items-end">
      <Body
        className="text-hjul-dark line-clamp-2 text-lg font-medium leading-7"
      >
        {body}
      </Body>
      <IconLink
        to={link}
        variant="mutedSharp"
        subVariant="rounded"
        size="large"
        icon={ArrowRight}
        className="text-hjul-dark ml-auto !rounded-[20px] !bg-[#EFECE8]"
        aria-label={ariaLabel}
      />
    </Row>
  </Base>
);
