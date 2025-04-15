import { useParams } from 'react-router-dom';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { Button } from '@components/shadcn/Button';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { useQuery } from '@tanstack/react-query';
import { Vehicle } from '@data/vehicle/types';
import { OpenBadge } from '@components/OpenBadge';
import { Page } from '@components/Page';
import { Breadcrumbs } from '@components/BreadCrumbs';
import { CardImageAbove } from '@components/CardImageAbove';
import type { Shop } from '@data/webedit/shop/types';
import { createGetPublicVehiclesByLocation } from '@data/vehicle/api';
import { CardDefault } from '@components/CardDefault';
import { useMemo, useState } from 'react';

const ITEMS_TO_LOAD = 6;

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const { data: preloadedData, currLocale } = usePreloadedDataLocalized();

  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_TO_LOAD);

  const currentShop = preloadedData?.shops?.find(
    (shop: Shop) => String(shop.id) === shopId,
  );

  const { data: availableBikes, isLoading: isLoadingVehicles } = useQuery({
    ...createGetPublicVehiclesByLocation({
      locationId: String(currentShop?.locationId),
    }),
    enabled: !!currentShop && typeof currentShop.locationId !== 'undefined',
  });

  const bikesToDisplay = useMemo(() => {
    return availableBikes?.slice(0, visibleItemsCount) || [];
  }, [availableBikes, visibleItemsCount]);

  const handleLoadMore = () => {
    setVisibleItemsCount((prevCount) => prevCount + ITEMS_TO_LOAD);
  };

  if (!currentShop) {
    return (
      <Page>
        <Section className="!pt-8 md:!pt-12">
          <SectionContent>
            <Breadcrumbs />
            <p className="text-muted-foreground mt-4 text-lg">
              Butiken kunde inte hittas.
            </p>
          </SectionContent>
        </Section>
      </Page>
    );
  }

  return (
    <Page
      heading={currentShop.name}
      showBreadcrumbs={true}
      headingSuffix={
        <OpenBadge openHours={currentShop.openHours} variant="large" />
      }
    >
      <Section className="!pb-8 !pt-8 md:!pt-12">
        <SectionContent>
          {currentShop.imageURL && (
            <div
              className="flex max-h-[659px] items-center justify-center
                overflow-hidden rounded-lg"
            >
              <img
                src={currentShop.imageURL}
                alt={`${currentShop.name} exteriör`}
                className="h-full w-full object-contain"
              />
            </div>
          )}
        </SectionContent>
      </Section>

      <Section className="pb-8 pt-0">
        <SectionContent>
          <div className="mx-auto max-w-2xl">
            <CardDefault
              variant="muted"
              title={preloadedData.generalContent.justDropByTitle}
              body={
                <>
                  {preloadedData.generalContent.justDropByBodyBold && (
                    <strong>
                      {preloadedData.generalContent.justDropByBodyBold}
                    </strong>
                  )}
                  {preloadedData.generalContent.justDropByBodyBold &&
                    preloadedData.generalContent.justDropByBodyRegular &&
                    ' '}
                  {preloadedData.generalContent.justDropByBodyRegular}
                </>
              }
              link={`/${currLocale}/services`}
              linkLabel="About our services"
              ariaLabel="About our services"
            />
          </div>
        </SectionContent>
      </Section>

      <Section>
        <SectionContent heading="Available bikes">
          {isLoadingVehicles ? null : availableBikes &&
            availableBikes.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {bikesToDisplay.map((bike: Vehicle) => (
                  <CardImageAbove
                    key={bike.id}
                    imageSrc={'/placeholderbike.jpg'}
                    imageAlt={`${bike.bikeType} ${bike.brand}`}
                    title={`${bike.bikeType} ${bike.brand}`}
                    subHeading={currentShop.name}
                    address={currentShop.address}
                    openHours={currentShop.openHours}
                    useStrongSubHeading={true}
                    linkTo={`/${currLocale}/bikes/${bike.id}`}
                  />
                ))}
              </div>
              {availableBikes && visibleItemsCount < availableBikes.length && (
                <div className="mt-16 text-center">
                  <Button
                    variant="mutedSharp"
                    subVariant="rounded"
                    size="large"
                    className="border-border text-foreground hover:bg-muted px-8
                      py-3"
                    onClick={handleLoadMore}
                  >
                    Load more +
                  </Button>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground py-10 text-center text-lg">
              Inga tillgängliga cyklar i denna butik just nu.
            </p>
          )}
        </SectionContent>
      </Section>
    </Page>
  );
}
