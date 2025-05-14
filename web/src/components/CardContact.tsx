import React from 'react';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';

import { Base, Title } from '@components/Card';
import { Bullet } from '@components/Bullet';
import { OpenBadge } from '@components/OpenBadge';
import { OpenHours } from '@data/webedit/shop/types';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

interface CardContactProps {
  name: string;
  address: string;
  phone: string;
  email: string;
  openHours: OpenHours;
  latitude: number;
  longitude: number;
  className?: string;
  showHeader?: boolean;
}

const groupOpenHours = (
  openHours: OpenHours,
  dayLabels: string[],
  closedLabel: string,
): { days: string; time: string }[] => {
  const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const result: { days: string; time: string }[] = [];

  let currentTime =
    openHours[keys[0] as keyof OpenHours]?.trim() || closedLabel;
  let start = 0;

  for (let i = 1; i <= keys.length; i++) {
    const time = openHours[keys[i] as keyof OpenHours]?.trim() || closedLabel;

    if (time !== currentTime || i === keys.length) {
      const label =
        start === i - 1
          ? dayLabels[start]
          : `${dayLabels[start]}–${dayLabels[i - 1]}`;
      result.push({ days: label, time: currentTime });
      start = i;
      currentTime = time;
    }
  }

  return result;
};

export const CardContact: React.FC<CardContactProps> = ({
  name,
  address,
  phone,
  email,
  openHours,
  latitude,
  longitude,
  showHeader = true,
}) => {
  const { data } = usePreloadedDataLocalized();
  const embedUrl = `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  const dayLabels = [
    data.generalContent.contactMonday,
    data.generalContent.contactTuesday,
    data.generalContent.contactWednesday,
    data.generalContent.contactThursday,
    data.generalContent.contactFriday,
    data.generalContent.contactSaturday,
    data.generalContent.contactSunday,
  ];

  const closedLabel = data.generalContent.contactClosed;

  return (
    <Base
      variant="default"
      className="flex flex-col gap-8 2xl:h-full 2xl:flex-row 2xl:items-stretch"
    >
      <div className="flex flex-1 flex-col gap-8">
        {showHeader && (
          <div
            className="justify-left flex flex-col gap-4 lg:flex-row
              lg:items-center"
          >
            <Title className="text-h3">{name}</Title>
            <OpenBadge
              openHours={openHours}
              variant="large"
              className="mt-2 w-fit lg:mt-0"
            />
          </div>
        )}

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
              {groupOpenHours(openHours, dayLabels, closedLabel).map(
                ({ days, time }) => (
                  <span key={days}>
                    {days}: {time}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full 2xl:w-1/2">
        <iframe
          src={embedUrl}
          className="h-full h-full max-h-[425px] min-h-[250px] w-full rounded-md
            border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${name}`}
        />
      </div>
    </Base>
  );
};
