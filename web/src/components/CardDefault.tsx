import { ArrowRight, LucideIcon } from 'lucide-react';

import { Base, Body, CardBaseProps, Icon, Title } from '@components/Card';
import { buttonVariants, IconLink, LinkProps } from '@components/shadcn/Button';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@utils';

interface CardDefaultProps {
  variant?: CardBaseProps['variant'];
  icon?: LucideIcon;
  title: string;
  subHeading?: string;
  body: React.ReactNode;
  link: LinkProps['to'];
  ariaLabel?: string;
  linkLabel?: string;
  className?: string;
  buttonVariant?: VariantProps<typeof buttonVariants>['variant'];
  buttonAlign?: 'start' | 'end' | 'center';
}

export const CardDefault: React.FC<CardDefaultProps> = ({
  icon,
  title,
  subHeading,
  body,
  link,
  ariaLabel,
  linkLabel,
  variant,
  className,
  buttonVariant = 'contrast',
  buttonAlign = 'end',
}) => {
  const alignmentClass =
    buttonAlign === 'start'
      ? 'justify-start'
      : buttonAlign === 'center'
        ? 'justify-center'
        : 'justify-end';

  return (
    <Base variant={variant} className={className}>
      {icon && <Icon icon={icon} />}
      <Title className={'pb-4 pt-6'}>{title}</Title>
      {subHeading && (
        <p className="text-md text-muted-foreground -mt-2 mb-3">{subHeading}</p>
      )}
      <Body>{body}</Body>
      <div className={cn('mt-auto flex pt-6', alignmentClass)}>
        <IconLink
          to={link}
          variant={buttonVariant}
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
};
