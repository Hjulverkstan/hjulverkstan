import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

import { IconLink } from '@components/shadcn/Button';
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from '@components/shadcn/Dialog';
import { Base, Title, Icon } from '@components/Card';
import { Bullet } from '@components/Bullet';
import { cn } from '@utils';

interface CardServicesProps {
  title: string;
  icon: LucideIcon;
  footerNote?: string;
  linkLabel: string;
  linkDestination: string;
  children?: React.ReactNode;
  mode?: 'page' | 'dialog';
  a11yDescription: string;
  a11yTitle: string;
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
        <p className="text-foreground text-base font-medium tracking-tight">
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
  a11yDescription,
  a11yTitle,
}) => {
  const inDialog = mode === 'dialog';
  const closeContent = (
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
  );

  return (
    <Base
      className={cn(
        'px-0',
        mode === 'dialog' && 'min-h-[65vh]' + 'h-[95vh]' + ' max-h-[95dvh]',
      )}
    >
      {inDialog && (
        <>
          <DialogTitle className="sr-only">
            {a11yTitle ?? a11yDescription}
          </DialogTitle>
          {a11yDescription && (
            <DialogDescription className="sr-only">
              {a11yDescription}
            </DialogDescription>
          )}
        </>
      )}
      <div className="space-y-6 px-8 pb-8">
        <Icon className="text-primary" icon={icon} />
        <Title>{title}</Title>
      </div>

      <div
        className={cn(
          mode === 'dialog' &&
            'min-h-0 flex-1 overflow-y-auto sm:overflow-visible',
        )}
      >
        <div className="divide-secondary-border -my-4 divide-y px-8">
          {children}
        </div>
      </div>

      <div className="space-y-6 px-8 pt-8">
        {footerNote && (
          <div className="text-base text-slate-500">{footerNote}</div>
        )}
        <div className="flex justify-end">
          {mode === 'dialog' ? (
            <DialogClose asChild>{closeContent}</DialogClose>
          ) : (
            closeContent
          )}
        </div>
      </div>
    </Base>
  );
};
