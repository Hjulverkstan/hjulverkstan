import { IconLink, LinkProps } from '@components/shadcn/Button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@utils';
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
}) => {
  return (
    <Base variant="compact" className={cn('flex flex-col', className)}>
      <Title className="text-h3 mb-4 line-clamp-1">{title}</Title>
      <Row className="mt-auto items-end">
        <Body className="line-clamp-2">{body}</Body>
        <IconLink
          to={link}
          variant="roundedMuted"
          icon={ArrowRight}
          className={cn('ml-auto h-10 w-10 flex-shrink-0')}
          aria-label={ariaLabel}
        />
      </Row>
    </Base>
  );
};
