import { IconLink, Link, LinkProps } from '@components/shadcn/Button';
import { ArrowRight, LucideIcon } from 'lucide-react';
import { cn } from '@utils';
import { Base, Body, Icon, Title } from '@components/Card';

interface CardDefaultProps {
  variant?: 'default' | 'baseGray';
  icon: LucideIcon;
  title: string;
  body: string;
  link: LinkProps['to'];
  ariaLabel: string;
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
}) => {
  return (
    <Base variant={variant} className={className}>
      <Icon icon={icon} />
      <Title className="mb-4 mt-6">{title}</Title>
      <Body>{body}</Body>

      <div className="mt-auto flex justify-end pt-4">
        {' '}
        {linkLabel ? (
          <Link
            to={link}
            variant="roundedPrimaryText"
            className={cn('h-10 text-lg')}
            aria-label={ariaLabel}
          >
            {linkLabel}
            <ArrowRight className="ml-2 h-6 w-6" />
          </Link>
        ) : (
          <IconLink
            to={link}
            variant="roundedPrimary"
            icon={ArrowRight}
            className={cn('h-10 w-10')}
            aria-label={ariaLabel}
          />
        )}
      </div>
    </Base>
  );
};
