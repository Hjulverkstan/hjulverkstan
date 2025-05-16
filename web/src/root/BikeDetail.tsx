import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  KeyRound as KeyIcon,
  Bike as BikeIcon,
  Flag as BrandIcon,
  Disc3 as BrakesIcon,
  Cog as GearsIcon,
  Ruler as SizeIcon,
  Tag as RegNoIcon,
  LucideProps,
} from 'lucide-react';
import { Page } from '@components/Page';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { OpenBadge } from '@components/OpenBadge';
import { IconButton, Button } from '@components/shadcn/Button';
import { CardImageAbove } from '@components/CardImageAbove';
import type { Vehicle as BaseVehicleType } from '@data/vehicle/types';
import type { Shop } from '@data/webedit/shop/types';
import {
  createGetPublicVehicleById,
  createGetPublicVehiclesByLocation,
} from '@data/vehicle/api';

const ITEMS_TO_LOAD_OTHER_BIKES = 3;

interface BikeAttribute {
  label: string;
  value?: string | number;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  > | null;
}

export default function BikeDetail() {
  const { bikeId } = useParams<{ bikeId: string }>();
  const { data: preloadedData, currLocale } = usePreloadedDataLocalized();

  const [visibleOtherBikesCount, setVisibleOtherBikesCount] = useState(
    ITEMS_TO_LOAD_OTHER_BIKES,
  );

  const { data: currentBike } = useQuery({
    ...createGetPublicVehicleById({ id: bikeId || '' }),
    enabled: !!bikeId,
  });

  const associatedShop = useMemo(() => {
    const bikeLocationId = (currentBike as any)?.locationId;
    if (!currentBike || !bikeLocationId || !preloadedData?.shops) {
      return undefined;
    }
    return preloadedData.shops.find(
      (shop: Shop) => String(shop.locationId) === String(bikeLocationId),
    );
  }, [preloadedData?.shops, currentBike]);

  const { data: bikesFromShopQueryData, isLoading: isLoadingOtherBikes } =
    useQuery({
      ...createGetPublicVehiclesByLocation({
        locationId: String(associatedShop?.locationId),
      }),
      enabled:
        !!associatedShop &&
        typeof associatedShop.locationId !== 'undefined' &&
        !!currentBike,
    });

  const otherBikesAtShop = useMemo(() => {
    if (!bikesFromShopQueryData || !currentBike) {
      return [];
    }
    return (bikesFromShopQueryData as BaseVehicleType[]).filter(
      (vehicle: BaseVehicleType) =>
        String(vehicle.id) !== String(currentBike.id),
    );
  }, [bikesFromShopQueryData, currentBike]);

  const otherBikesToDisplay = useMemo(() => {
    return otherBikesAtShop.slice(0, visibleOtherBikesCount);
  }, [otherBikesAtShop, visibleOtherBikesCount]);

  const handleLoadMoreOtherBikes = () => {
    setVisibleOtherBikesCount(
      (prevCount) => prevCount + ITEMS_TO_LOAD_OTHER_BIKES,
    );
  };

  const vehicleData = currentBike;
  const bikeDisplayName =
    `${vehicleData?.brand} ${vehicleData?.vehicleType}`.trim() ||
    'Bike Details';

  const bikeDescriptionText = 'We offer rentals in shop only';
  const rentButtonText = 'Rent';

  const bikeAttributes: BikeAttribute[] = [
    { label: 'Bike Type', value: vehicleData?.vehicleType, Icon: BikeIcon },
    { label: 'Brand', value: vehicleData?.brand, Icon: BrandIcon },
    {
      label: 'Brakes',
      value: vehicleData?.brakeType,
      Icon: BrakesIcon,
    },
    {
      label: 'Gears',
      value: vehicleData?.gearCount,
      Icon: GearsIcon,
    },
    { label: 'Size', value: vehicleData?.size, Icon: SizeIcon },
    {
      label: 'RegTag',
      value: vehicleData?.regTag,
      Icon: RegNoIcon,
    },
  ].filter(
    (attr): attr is BikeAttribute & { value: string } =>
      (typeof attr.value === 'string' && attr.value.trim() !== '') ||
      typeof attr.value === 'number',
  );

  return (
    <Page variant="muted">
      <Section variant="muted">
        <SectionContent heading={bikeDisplayName} className="max-w-[1280px]">
          <div className="bg-secondary mb-8 rounded-lg sm:p-5">
            <div
              className="ml-16 mr-16 flex flex-col items-start p-2 sm:flex-row
                sm:items-center sm:justify-between"
            >
              {associatedShop && (
                <div className="flex items-center gap-x-2">
                  <p className="text-foreground text-lg">
                    Available at{' '}
                    <span className="font-bold">{associatedShop.name}</span>
                  </p>
                  <OpenBadge
                    openHours={associatedShop.openHours}
                    variant="badge"
                    className="whitespace-nowrap px-2 py-0.5 text-xs"
                  />
                </div>
              )}
              <div className="flex w-full items-center gap-x-3 sm:w-auto">
                <p className="text-foreground text-lg">{bikeDescriptionText}</p>
                <IconButton
                  icon={KeyIcon}
                  iconRight={true}
                  text={rentButtonText}
                  aria-label="Rent this bike"
                  variant="default"
                  size="default"
                  className="bg-success-accent text-background
                    hover:bg-success-accent h-8 rounded-full px-3 py-1 text-xs
                    font-medium"
                  onClick={() => {
                    alert('Rental functionality to be implemented.');
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-8 flex justify-center rounded-lg">
            <img
              src="/placeholderbike.jpg"
              alt={bikeDisplayName}
              className="max-h-[728px rounded-md object-contain"
            />
          </div>

          {bikeAttributes.length > 0 && (
            <div
              className="bg-muted flex flex-wrap items-center justify-center
                gap-x-4 gap-y-2 rounded-lg py-3 text-xs sm:gap-x-12 sm:text-lg"
            >
              {bikeAttributes.map((attr) => {
                const IconComponent = attr.Icon;
                return (
                  <div
                    key={attr.label}
                    className="text-secondary-foreground flex items-center"
                  >
                    {IconComponent && (
                      <IconComponent
                        className="mr-2 h-4 w-4 flex-shrink-0 sm:mr-3 sm:h-5
                          sm:w-5"
                        aria-hidden="true"
                      />
                    )}
                    <span className="mr-2 sm:mr-3">{attr.label}</span>
                    <span className="text-foreground font-bold">
                      {attr.value}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </SectionContent>
      </Section>

      {associatedShop && otherBikesToDisplay.length > 0 && (
        <Section>
          <SectionContent heading="Other bikes">
            {isLoadingOtherBikes && <p>Loading other bikes...</p>}
            {!isLoadingOtherBikes && (
              <>
                <div
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2
                    lg:grid-cols-3"
                >
                  {otherBikesToDisplay.map((bike: BaseVehicleType) => {
                    const otherVehicleData = bike as any;
                    return (
                      <CardImageAbove
                        key={bike.id}
                        imageSrc={'/placeholderbike.jpg'}
                        imageAlt={`${otherVehicleData.bikeType} ${otherVehicleData.brand}`.trim()}
                        title={`${otherVehicleData.bikeType} ${otherVehicleData.brand}`.trim()}
                        subHeading={associatedShop.name}
                        address={associatedShop.address}
                        openHours={associatedShop.openHours}
                        useStrongSubHeading={true}
                        linkTo={`/${currLocale}/bikes/${bike.id}`}
                      />
                    );
                  })}
                </div>
                {otherBikesAtShop.length > visibleOtherBikesCount && (
                  <div className="mt-16 text-center">
                    <Button
                      variant="mutedSharp"
                      subVariant="rounded"
                      size="large"
                      className="border-border text-foreground hover:bg-muted
                        border px-8 py-3"
                      onClick={handleLoadMoreOtherBikes}
                    >
                      {preloadedData?.generalContent?.buttonLabelLoadMore ||
                        'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
            {!isLoadingOtherBikes &&
              otherBikesToDisplay.length === 0 &&
              preloadedData?.generalContent?.messageNoOtherBikes && (
                <p>{preloadedData.generalContent.messageNoOtherBikes}</p>
              )}
          </SectionContent>
        </Section>
      )}
    </Page>
  );
}
