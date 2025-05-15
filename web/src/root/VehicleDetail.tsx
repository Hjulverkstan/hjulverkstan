import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Bike, Cog, Disc3, Flag, Key, LucideIcon, Ruler } from 'lucide-react';

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
}

const VehicleAttribute = ({ icon: Icon, label, value }: VehicleAttributeProps) =>
  value !== undefined && (
    <div key={label} className="text-secondary-foreground flex items-center">
      {Icon && (
        <Icon
          className="mr-2 h-4 w-4 flex-shrink-0 sm:mr-3 sm:h-5 sm:w-5"
          aria-hidden="true"
        />
      )}
      <span className="mr-2 sm:mr-3">{label}</span>
      <span className="text-foreground font-bold">{value}</span>
    </div>
  );

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
    [vehicleQ.data],
  );

  const handleLoadMoreOtherBikes = () =>
    setVisibleCount((prevCount) => prevCount + ITEMS_TO_LOAD_OTHER_BIKES);

  return (
    <Page variant="muted">
      <Section variant="muted">
        <SectionContent heading={vehicleQ.data?.label} className="max-w-[1280px]">
          <div className="bg-secondary mb-8 rounded-lg sm:p-5">
            <div
              className="ml-16 mr-16 flex flex-col items-start p-2 sm:flex-row
                sm:items-center sm:justify-between"
            >
              {shop && (
                <div className="flex items-center gap-x-2">
                  <p className="text-foreground text-lg">
                    Available at <span className="font-bold">{shop.name}</span>
                  </p>
                  <OpenBadge
                    openHours={shop.openHours}
                    variant="badge"
                    className="whitespace-nowrap px-2 py-0.5 text-xs"
                  />
                </div>
              )}
              <div className="flex w-full items-center gap-x-3 sm:w-auto">
                <p className="text-foreground text-lg">
                  We offer rentals in shop only
                </p>
                <IconButton
                  icon={Key}
                  iconRight={true}
                  text="Rent"
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

          <div
            className="bg-muted border-border max-h-[728]px mb-8 flex
              justify-center rounded-lg border"
          >
            {vehicleQ.data?.imageURL ? (
              <ImageWithFallback
                src={vehicleQ.data.imageURL}
                alt={vehicleQ.data.regTag}
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
            ) : (
              <div
                className="text-muted-foreground/60 flex h-full items-center
                  justify-center"
              >
                <Bike size={40} />
              </div>
            )}

            {vehicleQ.data && (
              <div
                className="bg-muted flex flex-wrap items-center justify-center
                  gap-x-4 gap-y-2 rounded-lg py-3 text-xs sm:gap-x-12 sm:text-lg"
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
                  label="Brake Type"
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
                  icon={Cog}
                  label="Gears"
                  value={vehicleQ.data?.regTag}
                />
              </div>
            )}
          </div>
        </SectionContent>
      </Section>

      {shop && otherVehicles.length > 0 && (
        <Section>
          <SectionContent heading="Other bikes">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherVehicles.map((vehicle) => {
                return (
                  <CardVehicle key={vehicle.id} vehicle={vehicle} shop={shop} />
                );
              })}
            </div>
            {otherVehicles.length > visibleCount && (
              <div className="mt-16 text-center">
                <Button
                  variant="mutedSharp"
                  subVariant="rounded"
                  size="large"
                  className="border-border text-foreground hover:bg-muted border
                    px-8 py-3"
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
