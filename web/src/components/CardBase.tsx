import { Link, LinkProps } from 'react-router-dom';
import { Card } from '@components/Card';
import { Button } from '@components/shadcn/Button';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@utils';

interface CardBaseProps {
  icon: LucideIcon;
  title: string;
  body: string;
  link: LinkProps['to'];
  linkLabel?: string;
  ariaLabel: string;
  variant?: string;
  className?: string;
}

export const CardBase: React.FC<CardBaseProps> = ({
  icon,
  title,
  body,
  link,
  linkLabel,
  ariaLabel,
  variant,
  className,
}) => {
  return (
    <Card.Base variant={variant} className={cn('flex flex-col', className)}>
      <Card.Icon icon={icon} />
      <Card.Title>{title}</Card.Title>
      <Card.Body>{body}</Card.Body>
      <Button
        asChild={!linkLabel}
        variant="roundedPrimary"
        className={cn('mt-auto', linkLabel ? '' : 'ml-auto h-8 w-8 p-0')}
        aria-label={ariaLabel}
      >
        <Link to={link}>
          {linkLabel ? (
            <>
              {linkLabel}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </Link>
      </Button>
    </Card.Base>
  );
};
