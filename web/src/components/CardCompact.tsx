import { Link, LinkProps } from 'react-router-dom';
import { Card } from '@components/Card';
import { Button } from '@components/shadcn/Button';
import { ArrowRight } from 'lucide-react';

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
    <Card.Base variant="compact" className={className}>
      <Card.Title>{title}</Card.Title>
      <Card.Row>
        <Card.Body className="line-clamp-2">{body}</Card.Body>
        <Button
          asChild
          variant="roundedMuted"
          className="ml-auto h-8 w-8 flex-shrink-0 p-0"
          aria-label={ariaLabel}
        >
          <Link to={link}>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </Card.Row>
    </Card.Base>
  );
};
