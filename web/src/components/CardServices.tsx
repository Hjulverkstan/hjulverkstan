import React from 'react';
import { LucideIcon } from 'lucide-react';
import { LinkProps } from '@components/shadcn/Button';
import { Row } from '@components/Card';
import { Bullet } from '@components/Bullet';
import { CardDefault } from '@components/CardDefault';

interface CardServicesProps {
  services: {
    title: string;
    icon: LucideIcon;
    steps: {
      icon: LucideIcon;
      label: string;
      description: string;
    }[];
    footerNote?: string;
    cta: {
      label: string;
      link: LinkProps['to'];
    };
  };
}

export const CardServices: React.FC<CardServicesProps> = ({ services }) => {
  const { title, steps, footerNote, cta } = services;

  return (
    <CardDefault
      icon={services.icon}
      title={title}
      body=""
      link={cta.link}
      linkLabel={cta.label}
      className="space-y-2"
      iconClassName="text-black"
      iconSize={48}
      iconLinkClassName="bg-gray-200 text-gray-700 hover:bg-gray-300 text-base font-bold"
    >
      {steps.map((step, index) => (
        <Row key={index} className="flex flex-col">
          <Bullet icon={step.icon} size={28} iconClassName="text-slate-700">
            <div>
              <p className="ml-2 text-base text-black">{step.label}</p>
              <p className="ml-2 text-base text-zinc-500">{step.description}</p>
            </div>
          </Bullet>
          <div className="w-full border-b border-[#00000012]" />
        </Row>
      ))}
      {footerNote && (
        <div className="pt-4">
          <p className="text-base text-slate-500">{footerNote}</p>
        </div>
      )}
    </CardDefault>
  );
};
