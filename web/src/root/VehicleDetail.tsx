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

// TODO: Vehicle enums (bikeType, size etc.) are currently not
//  localized. This should be addressed once the feature for static text
//  localization is merged: https://github.com/Hjulverkstan/hjulverkstan/issues/226

const VehicleAttribute = ({
  icon: Icon,
  label,
  value,
}: VehicleAttributeProps) =>
  value !== undefined && (
    <div
      key={label}
      className="text-secondary-foreground mb-4 flex items-center md:mb-0"
    >
      {Icon && (
        <Icon className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
      )}
      <span className="mr-2">{label}</span>
      <span className="text-foreground font-small mr-3 md:mr-0">{value}</span>
    </div>
  );

const ShopRentalSection = ({ shop }: { shop: any }) => {
  const { data: preloadedData } = usePreloadedDataLocalized();

  return (
    <>
      <div className="flex w-full flex-1 justify-center">
        {shop && (
          <div
            className="flex flex-col items-center gap-4 lg:flex-row
              lg:items-center lg:gap-4"
          >
            <p
              className="text-foreground text-center text-xl md:mb-4 md:mt-4
                lg:mb-0 lg:mt-0"
            >
              {preloadedData.generalContent.bikeDetailOpenBadgeText}{' '}
              <span className="font-bold">{shop.name}</span>
            </p>
            <OpenBadge openHours={shop.openHours} variant="large" />
          </div>
        )}
      </div>
      <div
        className="hidden w-full border-collapse border-r-0 border-t-2
          border-dashed sm:w-auto sm:border-r-2 sm:border-t-0 md:-mb-2 md:-mt-2
          md:block lg:-mb-6 lg:-mt-6"
      ></div>
      <div className="w-full border-t-2 border-dashed md:hidden"></div>

      <div
        className="flex w-full flex-1 flex-col items-center text-center
          lg:flex-row lg:items-center lg:gap-4"
      >
        <p
          className="text-foreground mb-0 mt-2 text-lg font-medium md:mt-4
            lg:mt-0"
        >
          {preloadedData.generalContent.bikdeDetailRentText}
        </p>
        <IconButton
          icon={KeyRound}
          iconRight
          text="Rent"
          aria-label="Rent this bike"
          variant="default"
          size="default"
          className="bg-green-accent text-background hover:bg-success-accent
            -mb-5 mt-4 h-8 rounded-full md:mb-2 md:mt-2 lg:mb-0 lg:mt-2"
        />
      </div>
    </>
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
    [vehiclesQ.data, id],
  );

  const handleLoadMoreOtherBikes = () =>
    setVisibleCount((prevCount) => prevCount + ITEMS_TO_LOAD_OTHER_BIKES);

  console.log(vehiclesQ.data);

  return (
    <Page variant="muted">
      <Section variant="muted" className="sm: py-32">
        <SectionContent
          heading={vehicleQ.data?.label}
          className="max-w-[1280px]"
        >
          <div
            className="bg-secondary -mt-8 mb-12 hidden rounded-lg md:flex
              lg:p-4"
          >
            <div
              className="ml-12 mr-12 flex w-full flex-col gap-24 p-2 sm:flex-row
                sm:items-stretch sm:justify-around"
            >
              <ShopRentalSection shop={shop} />
            </div>
          </div>

          <div className="bg-muted flex w-full flex-col">
            {vehicleQ.data?.imageURL ? (
              <div className="mb-8 w-full">
                <ImageWithFallback
                  src={vehicleQ.data.imageURL}
                  alt={vehicleQ.data.regTag}
                  className="h-auto w-full rounded-lg object-contain"
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
                  label="Brakes"
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
                />
              </div>
            )}
          </div>
          <div
            className="bg-secondary mb-12 mt-20 block rounded-lg p-4 md:hidden"
          >
            <div
              className="mx-auto flex w-full max-w-md flex-col gap-y-4 px-4
                sm:px-6"
            >
              <div className="mt-6 flex w-full flex-col gap-y-6">
                <ShopRentalSection shop={shop} />
              </div>
              <div className="mb-8"></div>
            </div>
          </div>
        </SectionContent>
      </Section>

      {shop && otherVehicles.length > 0 && (
        <Section>
          <SectionContent
            heading={preloadedData.generalContent.sectionTitleOtherBikesText}
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
                  {preloadedData.generalContent?.buttonLabelLoadMore ||
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
