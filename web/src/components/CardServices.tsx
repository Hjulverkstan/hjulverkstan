import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

import { IconLink } from '@components/shadcn/Button';
import { Base, Title, Icon } from '@components/Card';
import { Bullet } from '@components/Bullet';
import { cn } from '@utils';
import { DialogClose } from '@radix-ui/react-dialog';

interface CardServicesProps {
  title: string;
  icon: LucideIcon;
  footerNote?: string;
  linkLabel: string;
  linkDestination: string;
  children?: React.ReactNode;
  mode?: 'page' | 'dialog';
}

interface CardServicesStepsProps {
  icon: LucideIcon;
  label: string;
  description: string;
}

export const CardServicesSteps: React.FC<CardServicesStepsProps> = ({
  icon,
  label,
  description,
}) => {
  return (
    <Bullet
      icon={icon}
      iconSize={28}
      iconClassName="text-foreground"
      className="py-4"
    >
      <div className="ml-2">
        <p className="text-foregroundtext-base font-medium tracking-tight">
          {label}
        </p>
        <p className="text-base text-zinc-500">{description}</p>
      </div>
    </Bullet>
  );
};
export const CardServices: React.FC<CardServicesProps> = ({
  title,
  icon,
  footerNote,
  linkLabel,
  linkDestination,
  children,
  mode = 'page',
}) => {
  const inDialog = mode === 'dialog';

  return (
    <Base className={cn('px-0', inDialog && 'h-[80vh] max-h-[85dvh] w-full ')}>
      <div className="space-y-6 px-8 pb-8">
        <Icon className="text-primary" icon={icon} />
        <Title>{title}</Title>
      </div>

      <div className={cn(inDialog && 'min-h-0 flex-1 overflow-y-auto')}>
        <div className="divide-secondary-border -my-4 divide-y px-8">
          {children}
        </div>
      </div>

      <div className="space-y-6 px-8 pt-8">
        {footerNote && (
          <div className="text-base text-slate-500">{footerNote}</div>
        )}
        <DialogClose asChild>
          <div className="flex justify-end">
            <IconLink
              className=" h-10 rounded-full px-3 text-base"
              to={linkDestination}
              variant="secondarySharp"
              subVariant="rounded"
              size="large"
              text={linkLabel}
              aria-label={title}
              iconRight
              icon={ArrowRight}
            />
          </div>
        </DialogClose>
      </div>
    </Base>
  );
};
