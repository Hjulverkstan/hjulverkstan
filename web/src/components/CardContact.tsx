import React from 'react';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';

import { Base, Title } from '@components/Card';
import { Bullet } from '@components/Bullet';
import { OpenBadge } from '@components/OpenBadge';
import { OpenHours } from '@data/webedit/shop/types';

interface CardContactProps {
  name: string;
  address: string;
  phone: string;
  email: string;
  openHours: OpenHours;
  latitude: number;
  longitude: number;
  className?: string;
}

export const CardContact: React.FC<CardContactProps> = ({
  name,
  address,
  phone,
  email,
  openHours,
  latitude,
  longitude,
}) => {
  const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  const weekDays = [
    { key: 'mon', label: 'Mon' },
    {
      key: 'tue',
      label: 'Tue',
    },
    { key: 'wed', label: 'Wed' },
    { key: 'thu', label: 'Thu' },
    {
      key: 'fri',
      label: 'Fri',
    },
    { key: 'sat', label: 'Sat' },
    { key: 'sun', label: 'Sun' },
  ];

  return (
    <Base variant="default" className="gap-8 md:flex-row md:items-stretch">
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex items-center justify-between">
          <Title>{name}</Title>
          <OpenBadge openHours={openHours} variant="large" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Bullet icon={MapPin}>
              <p className="text-foreground ml-2 text-base">{address}</p>
            </Bullet>
            <Bullet icon={Phone}>
              <p className="text-foreground ml-2 text-base">{phone}</p>
            </Bullet>
            <Bullet icon={Mail}>
              <p className="text-foreground ml-2 text-base">{email}</p>
            </Bullet>
          </div>

          <hr className="border-border border-t" />

          <div className="text-muted-foreground flex w-full">
            <div className="mr-2">
              <CalendarDays size={20} aria-hidden="true" />
            </div>
            <div className="text-foreground ml-2 flex flex-col gap-1 text-base">
              {weekDays
                .filter(({ key }) => openHours[key]?.trim())
                .map(({ key, label }) => (
                  <span key={key}>
                    {label}: {openHours[key as keyof OpenHours]}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <iframe
          src={embedUrl}
          className="h-full max-h-[425px] w-full rounded-md border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${name}`}
        />
      </div>
    </Base>
  );
};
