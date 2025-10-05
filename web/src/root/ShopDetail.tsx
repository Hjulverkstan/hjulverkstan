import { useParams } from 'react-router-dom';

import { useMemo, useState } from 'react';

import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { Button } from '@components/shadcn/Button';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { OpenBadge } from '@components/OpenBadge';
import { Page } from '@components/Page';
import type { Shop } from '@data/webedit/shop/types';
import { CardDefault } from '@components/CardDefault';
import { usePublicVehiclesByLocationQ } from '@data/vehicle/queries';
import { CardVehicle } from '@components/CardVehicle';
import { CardContact } from '@components/CardContact';

const ITEMS_TO_LOAD = 6;

export default function ShopDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePreloadedDataLocalized();
  const shop = data.shops.find((shop: Shop) => shop.slug === slug)!;

  const vehiclesQ = usePublicVehiclesByLocationQ({
    locationId: shop?.locationId,
  });

  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_TO_LOAD);
  const vehicleIncremental = useMemo(
    () => vehiclesQ.data?.slice(0, visibleItemsCount) || [],
    [vehiclesQ.data, visibleItemsCount],
  );

  const handleLoadMore = () => {
    setVisibleItemsCount((prevCount) => prevCount + ITEMS_TO_LOAD);
  };

  return (
    <Page
      heading={
        <div
          className="flex flex-col items-baseline justify-start gap-6
            md:flex-row md:gap-y-8"
        >
          <h1>{shop?.name}</h1>
          <OpenBadge
            className="mb-0 md:-translate-y-[13px]"
            openHours={shop?.openHours}
            variant="large"
          />
        </div>
      }
    >
      <Section>
        <SectionContent>
          {shop?.imageURL && (
            <div
              className="flex max-h-[659px] items-center justify-center
                overflow-hidden rounded-lg"
            >
              <img
                src={shop?.imageURL}
                alt={`${shop?.name} exteriör`}
                className="h-full w-full object-contain"
              />
            </div>
          )}

          <div className="mt-8 flex flex-col gap-8 lg:flex-row">
            <CardContact
              shop={shop}
              variant="compact"
              className="w-full grow lg:min-w-[30rem]"
              showHeader={false}
            />
            <CardDefault
              variant="muted"
              className="shrink pt-1 lg:max-w-[38rem]"
              title={data.text.shopDetailJustDropByTitle}
              body={
                <>
                  <strong>{data.text.shopDetailJustDropByBodyBold}</strong>
                  {' ' + data.text.shopDetailsJustDropByBodyRegular}
                </>
              }
              link={`/services`}
              linkLabel={data.text.shopButtonLabelAboutServices}
              ariaLabel="About our services"
            />
          </div>
        </SectionContent>

        <SectionContent heading={data.text.sectionTitleAvailableBikes}>
          {vehiclesQ.data && (
            <>
              <div
                className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
              >
                {vehicleIncremental.map((vehicle) => (
                  <CardVehicle key={vehicle.id} shop={shop} vehicle={vehicle} />
                ))}
              </div>
              {vehicleIncremental &&
                visibleItemsCount < vehicleIncremental.length && (
                  <div className="mt-16 text-center">
                    <Button
                      variant="mutedSharp"
                      subVariant="rounded"
                      size="large"
                      onClick={handleLoadMore}
                    >
                      Load more
                    </Button>
                  </div>
                )}
            </>
          )}
        </SectionContent>
      </Section>
    </Page>
  );
}
