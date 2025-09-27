import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

import { IconLink } from '@components/shadcn/Button';
import { Base, Title, Icon } from '@components/Card';
import { Row } from '@components/Card';
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
    <Row className="flex flex-col pt-4">
      <Bullet icon={icon} iconSize={28} iconClassName="text-foreground">
        <div>
          <p
            className="text-foreground ml-2 text-base font-medium tracking-tight"
          >
            {label}
          </p>
          <p className="ml-2 text-base text-zinc-500">{description}</p>
        </div>
      </Bullet>
      <div className="w-full border-b border-[#00000012]" />
    </Row>
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
    <Base
      variant="muted"
      className={cn(
        'bg-background',
        inDialog &&
          'flex h-[80vh] max-h-[85dvh] w-full flex-col overflow-hidden',
      )}
    >
      <div
        className={cn(
          'mb-0 flex items-center justify-center',
          inDialog &&
            `bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky
            top-0 z-10 mb-2 p-4 backdrop-blur`,
        )}
      >
        <Icon className="text-primary" icon={icon} />
      </div>
      <div
        className={cn(
          'mb-6 flex items-center justify-start',
          inDialog && 'px-4 py-2',
        )}
      >
        <div className="w-full text-center">
          <Title>{title}</Title>
        </div>
      </div>

      <div className={cn(inDialog ? 'p-6,5 mb-0 flex-1 overflow-y-auto' : '')}>
        {children}

        {footerNote && !inDialog && (
          <div className="pt-4">
            <p className="text-base text-slate-500">{footerNote}</p>
          </div>
        )}
      </div>

      <div
        className={cn(
          'mt-auto flex justify-end pt-6',
          inDialog &&
            `bg-background/95 supports-[backdrop-filter]:bg-background/75 sticky
            bottom-0 z-10 mt-0 p-4 shadow-[0_-1px_0_0_rgb(0_0_0_/_0.06)]
            backdrop-blur`,
        )}
      >
        <IconLink
          to={linkDestination}
          variant="default"
          subVariant="rounded"
          size="large"
          text={linkLabel}
          aria-label={title}
          iconRight
          icon={ArrowRight}
          className="text-foreground bg-gray-100 text-base font-bold
            hover:bg-gray-300"
        />
      </div>

      {footerNote && inDialog && (
        <div className="px-4 pb-2 text-sm text-slate-500">{footerNote}</div>
      )}
    </Base>
  );
};
