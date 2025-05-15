import React from 'react';
import { CalendarDays, Mail, MapPin, Phone } from 'lucide-react';

import { Base, Title } from '@components/Card';
import { Bullet } from '@components/Bullet';
import { OpenBadge } from '@components/OpenBadge';
import { OpenHours, Shop } from '@data/webedit/shop/types';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

interface CardContactProps {
  shop: Shop;
  variant?: 'default' | 'muted' | 'compact';
  className?: string;
  showHeader?: boolean;
}

const groupOpenHours = (
  openHours: OpenHours,
  dayLabels: string[],
  closedLabel: string,
): {
  days: string;
  time: string;
}[] => {
  const keys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  const result: { days: string; time: string }[] = [];
  let groupStartTime = openHours[keys[0]]?.trim() || closedLabel;
  let groupStartDayIndex = 0;

  for (let i = 1; i < keys.length; i++) {
    const currentDayTime = openHours[keys[i]]?.trim() || closedLabel;
    if (currentDayTime !== groupStartTime) {
      const endDayIndex = i - 1;
      const daysLabel =
        groupStartDayIndex === endDayIndex
          ? dayLabels[groupStartDayIndex]
          : `${dayLabels[groupStartDayIndex]}–${dayLabels[endDayIndex]}`;
      result.push({ days: daysLabel.replace(/–/g, '-'), time: groupStartTime });

      groupStartDayIndex = i;
      groupStartTime = currentDayTime;
    }
  }

  const lastDaysLabel =
    groupStartDayIndex === keys.length - 1
      ? dayLabels[groupStartDayIndex]
      : `${dayLabels[groupStartDayIndex]}–${dayLabels[keys.length - 1]}`;
  result.push({ days: lastDaysLabel.replace(/–/g, '-'), time: groupStartTime });

  return result;
};

export const CardContact: React.FC<CardContactProps> = ({
  shop,
  variant = 'default',
  className,
  showHeader = true,
}) => {
  const { data } = usePreloadedDataLocalized();
  const embedUrl = `https://maps.google.com/maps?q=${shop?.latitude},${shop?.longitude}&z=15&output=embed`;

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

  if (variant === 'compact') {
    return (
      <Base
        variant="muted"
        className={`flex flex-col p-8 md:flex-row md:items-stretch md:gap-8
        ${className || ''}`}
      >
        <div className="flex flex-1 flex-col">
          <div className="flex flex-col">
            <div className="flex items-center gap-4">
              <MapPin
                size={24}
                className="text-muted-foreground flex-shrink-0"
              />
              <p className="text-foreground max-w-md text-sm">
                {shop?.address}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Phone
                size={24}
                className="text-muted-foreground mb-2 mt-2 flex-shrink-0"
              />
              <p className="text-foreground text-sm">{shop?.phone || 'N/A'}</p>
            </div>
            <div className="flex items-center gap-4">
              <Mail size={24} className="text-muted-foreground flex-shrink-0" />
              <p className="text-foreground text-sm">
                {shop?.contactEmail || 'N/A'}
              </p>
            </div>
          </div>

          <hr className="border-border mb-4 mt-4" />

          <div className="flex items-start gap-4">
            <CalendarDays
              size={24}
              className="text-muted-foreground -mt-[1px] flex-shrink-0"
            />
            <div className="text-foreground flex flex-col gap-0.5 text-sm">
              {shop?.openHours ? (
                groupOpenHours(shop.openHours, dayLabels, closedLabel).map(
                  ({ days, time }) => (
                    <div key={days}>
                      {days}: {time}
                    </div>
                  ),
                )
              ) : (
                <span>{closedLabel}</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 w-full md:mt-0 md:w-2/4 xl:w-2/4">
          <iframe
            src={embedUrl}
            className="h-[200px] w-full rounded-md border-0 md:h-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location of ${shop?.name}`}
          />
        </div>
      </Base>
    );
  }

  return (
    <Base
      variant={variant}
      className={`flex flex-col gap-8 2xl:h-full 2xl:flex-row 2xl:items-stretch
      ${className || ''}`}
    >
      <div className="flex flex-1 flex-col gap-8">
        {showHeader && (
          <div
            className="justify-left flex flex-col gap-4 lg:flex-row
              lg:items-center"
          >
            <Title className="text-h3">{shop?.name}</Title>
            <OpenBadge
              openHours={shop?.openHours}
              variant="large"
              className="mt-2 w-fit lg:mt-0"
            />
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Bullet icon={MapPin}>
              <p className="text-foreground ml-2 text-base">{shop?.address}</p>
            </Bullet>
            <Bullet icon={Phone}>
              <p className="text-foreground ml-2 text-base">
                {shop?.phone || 'N/A'}
              </p>
            </Bullet>
            <Bullet icon={Mail}>
              <p className="text-foreground ml-2 text-base">
                {shop?.contactEmail || 'N/A'}
              </p>
            </Bullet>
          </div>

          <hr className="border-border border-t" />

          <div className="flex items-start gap-2">
            <CalendarDays
              size={20}
              aria-hidden="true"
              className="text-muted-foreground mt-1 flex-shrink-0"
            />
            <div className="text-foreground flex flex-col gap-1 text-base">
              {shop?.openHours ? (
                groupOpenHours(shop.openHours, dayLabels, closedLabel).map(
                  ({ days, time }) => (
                    <span key={days}>
                      {days}: {time}
                    </span>
                  ),
                )
              ) : (
                <span>{closedLabel}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full 2xl:w-1/2">
        <iframe
          src={embedUrl}
          className="h-full max-h-[425px] min-h-[250px] w-full rounded-md
            border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${shop?.name}`}
        />
      </div>
    </Base>
  );
};
