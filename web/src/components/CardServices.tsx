import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';

import { IconLink } from '@components/shadcn/Button';
import { Base, Title, Icon } from '@components/Card';
import { Row } from '@components/Card';
import { Bullet } from '@components/Bullet';

interface CardServicesProps {
  title: string;
  icon: LucideIcon;
  footerNote?: string;
  linkLabel: string;
  linkDestination: string;
  children?: React.ReactNode;
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
      <Bullet icon={icon} iconSize={28} iconClassName="text-slate-700">
        <div>
          <p className="text-foreground ml-2 text-base">{label}</p>
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
}) => {
  return (
    <Base variant="muted" className="bg-background">
      <div className="mb-8 flex items-center justify-start">
        <Icon className="text-foreground" icon={icon} />
      </div>
      <div className="mb-6 flex items-center justify-start">
        <Title>{title}</Title>
      </div>
      {children}
      {footerNote && (
        <div className="pt-4">
          <p className="text-base text-slate-500">{footerNote}</p>
        </div>
      )}
      <div className="mt-auto flex justify-end pt-6 ">
        <IconLink
          to={linkDestination}
          variant="default"
          subVariant="rounded"
          size="large"
          text={linkLabel}
          aria-label={title}
          iconRight
          icon={ArrowRight}
          className="text-foreground bg-gray-100 text-base hover:bg-gray-300"
        />
      </div>
    </Base>
  );
};
