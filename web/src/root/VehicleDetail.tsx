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

const ITEMS_TO_LOAD_OTHER_BIKES = 3;

interface VehicleAttributeProps {
  icon: LucideIcon;
  label: string;
  value?: string | number;
  preserveCase?: boolean;
}

const capitalizeFirstLetter = (string?: string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const VehicleAttribute = ({
  icon: Icon,
  label,
  value,
  preserveCase,
}: VehicleAttributeProps) => {
  const displayValue =
    typeof value === 'string' && !preserveCase
      ? capitalizeFirstLetter(value)
      : value;

  return (
    value !== undefined && (
      <div key={label} className="text-secondary-foreground flex items-center">
        {Icon && (
          <Icon className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
        )}
        <span className="mr-2 sm:mr-3">{label}</span>
        <span className="text-foreground font-medium">{displayValue}</span>
      </div>
    )
  );
};

export default function VehicleDetail() {
  const { id } = useParams() as { id: string };
  const { data: preloadedData } = usePreloadedDataLocalized();

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
    [vehicleQ.data, vehiclesQ.data, id],
  );

  const handleLoadMoreOtherBikes = () =>
    setVisibleCount((prevCount) => prevCount + ITEMS_TO_LOAD_OTHER_BIKES);

  return (
    <Page variant="muted">
      <Section variant="muted">
        <SectionContent
          heading={vehicleQ.data?.label}
          className="max-w-[1280px]"
        >
          <div className="bg-secondary -mt-8 mb-12 rounded-lg p-4">
            <div
              className="ml-12 mr-12 flex flex-col items-start gap-4 p-2
                sm:flex-row sm:items-stretch sm:justify-between sm:gap-0"
            >
              <div className="w-full sm:flex-1">
                {shop && (
                  <div className="flex flex-wrap items-center gap-x-2">
                    <p className="text-foreground text-base text-xl">
                      {preloadedData?.generalContent.bikeDetailOpenBadgeText}{' '}
                      <span className="font-bold">{shop.name}</span>
                    </p>
                    <OpenBadge openHours={shop.openHours} variant="large" />
                  </div>
                )}
              </div>

              <div
                className="w-full border-collapse border-r-0 border-t-2
                  border-dashed sm:-mb-6 sm:-mt-6 sm:w-auto sm:border-r-2
                  sm:border-t-0"
              ></div>

              <div
                className="flex w-full flex-wrap items-center gap-x-3 sm:flex-1
                  sm:justify-end"
              >
                <p className="text-foreground text-base text-lg font-medium">
                  {preloadedData?.generalContent.bikdeDetailRentText}
                </p>
                <IconButton
                  icon={KeyRound}
                  iconRight={true}
                  text="Rent"
                  aria-label="Rent this bike"
                  variant="default"
                  size="default"
                  className="bg-green-accent text-background
                    hover:bg-success-accent h-8 rounded-full"
                />
              </div>
            </div>
          </div>

          <div className="bg-muted flex w-full flex-col">
            {vehicleQ.data?.imageURL ? (
              <div
                className="mb-8 aspect-[4/3] max-h-[728px] overflow-hidden
                  rounded-lg sm:aspect-video"
              >
                <ImageWithFallback
                  src={vehicleQ.data.imageURL}
                  alt={
                    vehicleQ.data.regTag
                      ? capitalizeFirstLetter(vehicleQ.data.regTag)
                      : ''
                  }
                  className="h-full w-full object-cover"
                  fallback={
                    <Error
                      className="h-full"
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
                className="text-muted-foreground/60 flex items-center
                  justify-center"
              >
                <Bike size={40} />
              </div>
            )}

            {vehicleQ.data && (
              <div
                className="bg-muted -mb-16 flex flex-wrap items-center
                  justify-center gap-4 text-lg sm:gap-x-8"
              >
                <VehicleAttribute
                  icon={Bike}
                  label="Bike Type"
                  value={vehicleQ.data?.bikeType}
                />
                <VehicleAttribute
                  icon={Flag}
                  label="Brand"
                  value={vehicleQ.data?.brand}
                />
                <VehicleAttribute
                  icon={Disc3}
                  label="Breakes"
                  value={vehicleQ.data?.brakeType}
                />
                <VehicleAttribute
                  icon={Cog}
                  label="Gears"
                  value={vehicleQ.data?.gearCount}
                />
                <VehicleAttribute
                  icon={Ruler}
                  label="Size"
                  value={vehicleQ.data?.size}
                />
                <VehicleAttribute
                  icon={Tag}
                  label="Reg. No."
                  value={vehicleQ.data?.regTag}
                  preserveCase={true}
                />
              </div>
            )}
          </div>
        </SectionContent>
      </Section>

      {shop && otherVehicles.length > 0 && (
        <Section>
          <SectionContent
            heading={preloadedData?.generalContent.sectionTitleOtherBikesText}
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  {preloadedData?.generalContent?.buttonLabelLoadMore ||
                    'Load More'}
                </Button>
              </div>
            )}
          </SectionContent>
        </Section>
      )}
    </Page>
  );
}
