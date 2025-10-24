import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Bike,
  Cog,
  Disc3,
  Flag,
  KeyRound,
  LucideIcon,
  Ruler,
  Tag,
} from 'lucide-react';

import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { OpenBadge } from '@components/OpenBadge';
import { Button, IconButton } from '@components/shadcn/Button';
import { CardVehicle } from '@components/CardVehicle';
import { ImageWithFallback } from '@components/ImageWithFallback';
import { endpoints } from '@data/api';
import Error from '@components/Error';
import {
  usePublicVehicleByIdQ,
  usePublicVehiclesByLocationQ,
} from '@data/vehicle/queries';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import * as enumsRaw from '@data/vehicle/enums';
import { useTranslations } from '@hooks/useTranslations';
import { findEnum } from '@utils/enums';

const ITEMS_TO_LOAD_OTHER_BIKES = 3;

interface VehicleAttributeProps {
  icon: LucideIcon;
  label: string;
  value?: string | number;
  preserveCase?: boolean;
}

const VehicleAttribute = ({
  icon: Icon,
  label,
  value,
}: VehicleAttributeProps) =>
  value !== undefined && (
    <div key={label} className="text-secondary-foreground flex items-center">
      {Icon && (
        <Icon className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
      )}
      <span className="mr-2">{label}</span>
      <span className="text-foreground font-small">{value}</span>
    </div>
  );

const ShopRentalSection = ({ shop }: { shop: any }) => {
  const { data: preloadedData } = usePreloadedDataLocalized();

  const { t } = useTranslations();

  return (
    <>
      {shop && (
        <div
          className="my-8 flex w-full flex-1 flex-col items-center
            justify-center gap-4 lg:my-4 lg:ml-8 lg:mr-8 lg:flex-row
            lg:items-center"
        >
          <p className="text-foreground text-center text-xl">
            {preloadedData.text.bikeDetailOpenBadgeText}{' '}
            <span className="font-bold">{shop.name}</span>
          </p>
          <OpenBadge
            openHours={shop.openHours}
            className="bg-white"
            variant="large"
          />
        </div>
      )}
      <div
        className="hidden w-full border-collapse border-r-0 border-t-2
          border-dashed sm:w-auto sm:border-r-2 sm:border-t-0 md:-mt-0 md:mb-0
          md:block lg:-mb-4 lg:-mt-4"
      ></div>
      <div className="w-full border-t-2 border-dashed md:hidden"></div>

      <div
        className="flex w-full flex-1 flex-col items-center gap-4 p-8
          text-center lg:flex-row lg:items-center lg:justify-center"
      >
        <p className="text-foreground text-lg font-medium">
          {preloadedData.text.bikdeDetailRentText}
        </p>
        <IconButton
          icon={KeyRound}
          iconRight
          text={t('rent')}
          aria-label={t('rentAria')}
          variant="default"
          size="default"
          className="bg-green-accent text-background hover:bg-success-accent
            rounded-full"
        />
      </div>
    </>
  );
};

export default function VehicleDetail() {
  const { id } = useParams() as { id: string };
  const { data: preloadedData } = usePreloadedDataLocalized();

  const { t } = useTranslations();
  const enums = useTranslateRawEnums(enumsRaw);

  const [visibleCount, setVisibleCount] = useState(ITEMS_TO_LOAD_OTHER_BIKES);

  const vehicleQ = usePublicVehicleByIdQ({ id });
  const vehiclesQ = usePublicVehiclesByLocationQ({
    locationId: vehicleQ.data?.locationId,
  });

  const shop = useMemo(
    () =>
      vehicleQ.data &&
      preloadedData.shops.find(
        (shop) => shop.locationId === vehicleQ.data.locationId,
      ),
    [vehicleQ.data, preloadedData.shops],
  );

  const otherVehicles = useMemo(
    () =>
      vehiclesQ.data
        ?.filter((v) => v.id !== id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3) ?? [],
    [vehiclesQ.data, id],
  );

  const handleLoadMoreOtherBikes = () =>
    setVisibleCount((prevCount) => prevCount + ITEMS_TO_LOAD_OTHER_BIKES);

  return (
    <Page variant="muted">
      <Section variant="muted" className="pt-32 md:pb-20 md:pt-16">
        <SectionContent
          heading={
            vehicleQ.data
              ? `${findEnum(enums, vehicleQ.data.brand)?.label} ${findEnum(enums, vehicleQ.data.vehicleType)?.label}`
              : ''
          }
          className="max-w-[1280px]"
        >
          <div
            className="bg-secondary mb-8 hidden w-full flex-col rounded-lg
              sm:flex-row sm:items-stretch sm:justify-around md:flex lg:p-4"
          >
            <ShopRentalSection shop={shop} />
          </div>

          <div className="bg-muted flex w-full flex-col">
            {vehicleQ.data?.imageURL ? (
              <div className="mb-8 w-full">
                <ImageWithFallback
                  src={vehicleQ.data.imageURL}
                  alt={vehicleQ.data.regTag}
                  className="aspect-[16/9] h-auto w-full rounded-lg
                    object-cover"
                  fallback={
                    <Error
                      className="bg-secondary aspect-[16/9] h-full"
                      error={{
                        error: 'NOT_FOUND',
                        endpoint: endpoints.image,
                      }}
                    />
                  }
                />
              </div>
            ) : (
              <div
                className="bg-secondary text-muted-foreground/60 mb-8 flex
                  aspect-[16/9] w-full items-center justify-center rounded-lg"
              >
                <Bike size={40} />
              </div>
            )}

            {vehicleQ.data && (
              <div
                className="bg-muted mb-10 mt-2 flex flex-wrap items-center
                  justify-center gap-x-6 gap-y-4 text-lg sm:gap-x-10 md:mb-0"
              >
                <VehicleAttribute
                  icon={Bike}
                  label={t('bikeTypeLabel')}
                  value={findEnum(enums, vehicleQ.data?.bikeType).label}
                />
                <VehicleAttribute
                  icon={Flag}
                  label={t('brandLabel')}
                  value={findEnum(enums, vehicleQ.data?.brand).label}
                />
                <VehicleAttribute
                  icon={Disc3}
                  label={t('brakeTypeLabel')}
                  value={findEnum(enums, vehicleQ.data?.brakeType).label}
                />
                <VehicleAttribute
                  icon={Cog}
                  label={t('gearCountLabel')}
                  value={vehicleQ.data?.gearCount}
                />
                <VehicleAttribute
                  icon={Ruler}
                  label={t('sizeLabel')}
                  value={findEnum(enums, vehicleQ.data?.size).label}
                />
                <VehicleAttribute
                  icon={Tag}
                  label={t('regTagLabel')}
                  value={vehicleQ.data?.regTag}
                />
              </div>
            )}
          </div>
          <div
            className="bg-secondary mb-12 flex w-full flex-col rounded-lg
              md:hidden md:max-w-md md:p-4 md:px-4"
          >
            <ShopRentalSection shop={shop} />
          </div>
        </SectionContent>
      </Section>

      {shop && otherVehicles.length > 0 && (
        <Section>
          <SectionContent
            heading={preloadedData.text.sectionTitleOtherBikesText}
          >
            <div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {otherVehicles.slice(0, visibleCount).map((vehicle) => {
                return (
                  <CardVehicle key={vehicle.id} vehicle={vehicle} shop={shop} />
                );
              })}
            </div>
            {visibleCount < otherVehicles.length && (
              <div className="mt-16 text-center">
                <Button
                  variant="mutedSharp"
                  subVariant="rounded"
                  size="large"
                  className="text-foreground hover:bg-muted border px-8 py-3"
                  onClick={handleLoadMoreOtherBikes}
                >
                  {preloadedData.text.buttonLabelLoadMore || 'Load More'}
                </Button>
              </div>
            )}
          </SectionContent>
        </Section>
      )}
    </Page>
  );
}
