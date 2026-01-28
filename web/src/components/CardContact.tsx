import React from 'react';
import { CalendarDays, MapPin, Phone } from 'lucide-react';

import { Base, Title } from '@components/Card';
import { Bullet } from '@components/Bullet';
import { OpenBadge } from '@components/OpenBadge';
import { OpenHours, Shop } from '@data/webedit/shop/types';
import { cn } from '@utils/common';
import { useTranslations } from '@hooks/useTranslations';

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
  shop,
  variant = 'default',
  className,
  showHeader = true,
}) => {
  const { t } = useTranslations();
  const embedUrl = `https://www.google.com/maps?q=${shop?.latitude},${shop?.longitude}&z=15&output=embed`;

  const dayLabels = [
    t('monday'),
    t('tuesday'),
    t('wednesday'),
    t('thursday'),
    t('friday'),
    t('saturday'),
    t('sunday'),
  ];

  const closedLabel = t('closed');
  const isCompact = variant === 'compact';

  return (
    <Base
      variant={isCompact ? 'muted' : variant}
      className={cn(
        'flex flex-col',
        isCompact
          ? 'p-8 md:flex-row md:items-stretch md:gap-8'
          : 'gap-8 2xl:h-full 2xl:flex-row 2xl:items-stretch',
        className,
      )}
    >
      <div className={cn('flex flex-1 flex-col gap-8')}>
        {!isCompact && showHeader && (
          <div
            className={cn(
              'justify-left flex flex-col gap-4 lg:flex-row lg:items-center',
            )}
          >
            <Title className={cn('text-h3')}>{shop?.name}</Title>
            <OpenBadge
              openHours={shop?.openHours}
              variant="large"
              className={cn('mt-2 w-fit lg:mt-0')}
            />
          </div>
        )}

        <div className={cn('flex flex-col', !isCompact && 'gap-6')}>
          <div className={cn('flex flex-col', !isCompact && 'gap-3')}>
            <Bullet icon={MapPin}>
              <p
                className={cn(
                  'text-foreground',
                  isCompact ? 'text-sm' : 'ml-2 text-base',
                )}
              >
                {shop?.address}
              </p>
            </Bullet>
            <Bullet icon={Phone}>
              <p
                className={cn(
                  'text-foreground',
                  isCompact ? 'mb-2 mt-2 text-sm' : 'ml-2 text-base',
                )}
              >
                {shop?.phone || 'N/A'}
              </p>
            </Bullet>
          </div>

          <hr
            className={cn(
              'border-border',
              isCompact ? 'mb-4 mt-4' : 'border-t',
            )}
          />

          <div className={cn('flex items-start gap-2')}>
            <CalendarDays
              size={20}
              className={cn(
                'text-muted-foreground flex-shrink-0',
                isCompact ? '-mt-[1px]' : 'mt-1',
              )}
            />
            <div
              className={cn(
                'text-foreground flex flex-col gap-1',
                isCompact ? 'text-sm' : 'text-base',
              )}
            >
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

      <div
        className={cn(
          isCompact
            ? 'mt-8 w-full md:mt-0 md:w-2/4 xl:w-2/4'
            : 'w-full 2xl:w-1/2',
        )}
      >
        <iframe
          src={embedUrl}
          className={cn(
            'w-full rounded-md border-0',
            isCompact
              ? 'h-[200px] md:h-full'
              : 'h-full max-h-[425px] min-h-[250px]',
          )}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map showing location of ${shop?.name}`}
        />
      </div>
    </Base>
  );
};
