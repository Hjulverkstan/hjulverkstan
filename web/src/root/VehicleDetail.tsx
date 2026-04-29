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
import { ServicesAsDialogWrapper, ServicesHowToRentView } from './Services';
import { useDialogManager } from '@components/DialogManager';

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
    <div key={label} className="flex items-center text-secondary-foreground">
      {Icon && (
        <Icon className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
      )}
      <span className="mr-2">{label}</span>
      <span className="font-small text-foreground">{value}</span>
    </div>
  );

const ShopRentalSection = ({ shop }: { shop: any }) => {
  const { data } = usePreloadedDataLocalized();
  const { openDialog } = useDialogManager();
  const { t } = useTranslations();

  return (
    <>
      {shop && (
        <div
          className="my-8 flex w-full flex-1 flex-col items-center
            justify-center gap-4 lg:my-4 lg:ml-8 lg:mr-8 lg:flex-row
            lg:items-center"
        >
          <p className="text-center text-xl text-foreground">
            {t('availableAt')} <span className="font-bold">{shop.name}</span>
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
        <p className="text-lg font-medium text-foreground">
          {data.text.bikeDetailRentText}
        </p>
        <IconButton
          icon={KeyRound}
          iconRight
          text={t('rent')}
          aria-label={t('rentAria')}
          variant="default"
          size="default"
          className="hover:bg-success-accent rounded-full bg-green-accent
            text-background"
          onClick={() =>
            openDialog(
              <ServicesAsDialogWrapper>
                <ServicesHowToRentView
                  mode="dialog"
                  endpoint={shop.slug}
                  label={true}
                />
              </ServicesAsDialogWrapper>,
            )
          }
        />
      </div>
    </>
  );
};

export default function VehicleDetail() {
  const { id } = useParams() as { id: string };
  const { data } = usePreloadedDataLocalized();

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
      data.shops.find((shop) => shop.locationId === vehicleQ.data.locationId),
    [vehicleQ.data, data.shops],
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
    <Page
      heading={
        vehicleQ.data
          ? `${findEnum(enums, vehicleQ.data.brand)?.label} ${findEnum(enums, vehicleQ.data.vehicleType)?.label}`
          : ''
      }
      variant="muted"
      headingWidth="small"
    >
      <Section variant="muted" className="md:pb-20 md:pt-44">
        <SectionContent contentWidth="small">
          <div
            className="mb-8 hidden w-full flex-col rounded-lg bg-secondary
              sm:mt-8 sm:flex-row sm:items-stretch sm:justify-around
              sm:rounded-[32px] md:flex lg:p-4"
          >
            <ShopRentalSection shop={shop} />
          </div>

          <div className="flex w-full flex-col bg-muted">
            {vehicleQ.data?.imageURL ? (
              <div className="mb-8 w-full">
                <ImageWithFallback
                  src={vehicleQ.data.imageURL}
                  alt={vehicleQ.data.regTag}
                  className="aspect-[16/9] h-auto w-full rounded-lg object-cover
                    sm:rounded-[32px]"
                  fallback={
                    <Error
                      className="aspect-[16/9] h-full bg-secondary
                        sm:rounded-[32px]"
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
                className="mb-8 flex aspect-[16/9] w-full items-center
                  justify-center rounded-lg bg-secondary
                  text-muted-foreground/60"
              >
                <Bike size={40} />
              </div>
            )}

            {vehicleQ.data && (
              <div
                className="mb-10 mt-2 flex flex-wrap items-center justify-center
                  gap-x-6 gap-y-4 bg-muted text-lg sm:gap-x-10 md:mb-0"
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
            className="mb-12 flex w-full flex-col rounded-lg bg-secondary
              md:hidden md:max-w-md md:p-4 md:px-4"
          >
            <ShopRentalSection shop={shop} />
          </div>
        </SectionContent>
      </Section>

      {shop && otherVehicles.length > 0 && (
        <Section>
          <SectionContent heading={t('otherBikes')}>
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
                  className="border px-8 py-3 text-foreground hover:bg-muted"
                  onClick={handleLoadMoreOtherBikes}
                >
                  {t('loadMore')}
                </Button>
              </div>
            )}
          </SectionContent>
        </Section>
      )}
    </Page>
  );
}
