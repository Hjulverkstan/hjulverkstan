import { useParams } from 'react-router-dom';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { Button } from '@components/shadcn/Button';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { useQuery } from '@tanstack/react-query';
import { Vehicle } from '@data/vehicle/types';
import { OpenBadge } from '@components/OpenBadge';
import { Page } from '@components/Page';
import { CardImageAbove } from '@components/CardImageAbove';
import type { Shop } from '@data/webedit/shop/types';
import { createGetPublicVehiclesByLocation } from '@data/vehicle/api';
import { CardDefault } from '@components/CardDefault';
import { useMemo, useState } from 'react';

const ITEMS_TO_LOAD = 6;

export default function ShopDetail() {
  const { shopId } = useParams<{ shopId: string }>();
  const { data, currLocale } = usePreloadedDataLocalized();

  const [visibleItemsCount, setVisibleItemsCount] = useState(ITEMS_TO_LOAD);

  const currentShop = data.shops.find(
    (shop: Shop) => String(shop.id) === shopId,
  )!;

  const { data: availableBikes, isLoading: isLoadingVehicles } = useQuery({
    ...createGetPublicVehiclesByLocation({
      locationId: String(currentShop.locationId),
    }),
    enabled: typeof currentShop.locationId !== 'undefined',
  });

  const bikesToDisplay = useMemo(() => {
    return availableBikes?.slice(0, visibleItemsCount) || [];
  }, [availableBikes, visibleItemsCount]);

  const handleLoadMore = () => {
    setVisibleItemsCount((prevCount) => prevCount + ITEMS_TO_LOAD);
  };

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
          <div className="mx-auto grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
            <CardDefault
              variant="muted"
              title={data.generalContent.shopDetailJustDropByTitle}
              body={
                <>
                  {data.generalContent.shopDetailJustDropByBodyBold && (
                    <strong>
                      {data.generalContent.shopDetailJustDropByBodyBold}
                    </strong>
                  )}
                  {data.generalContent.shopDetailJustDropByBodyBold &&
                    data.generalContent.shopDetailJustDropByBodyRegular &&
                    ' '}
                  {data.generalContent.shopDetailsJustDropByBodyRegular}
                </>
              }
              link={`/services`}
              linkLabel={data.generalContent.shopButtonLabelAboutServices}
              ariaLabel="About our services"
            />
            <div
              className="flex h-full rotate-1 transform flex-col items-center
                justify-center rounded-lg border-4 border-dashed
                border-yellow-500 bg-lime-300 p-6 shadow-xl transition-transform
                duration-500 ease-in-out hover:rotate-0"
              style={{
                fontFamily:
                  "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive",
              }}
            >
              <img
                src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYmg5dHdkdHI4ZmdxN2Y4enp3cHM5anJ0b2E3eXlmc2FhZWJ5dWNnbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKRBB3E0g2umadO/giphy.gif"
                alt="Under Construction GIF"
                className="mb-4 h-24 w-24 animate-bounce"
              />
              <h2
                className="mb-2 text-3xl font-black text-purple-700"
                style={{ textShadow: '2px 2px #ff00ff' }}
              >
                To Be REVEALED!
              </h2>
              <p className="text-center text-sm font-medium text-blue-700">
                Something{' '}
                <strong className="text-red-500">AMAZINGLY UGLY</strong> is
                coming here... or maybe not. Who knows? 🤫
              </p>
              <p className="mt-4 text-xs text-pink-600">
                (Don't tell the designers I did this)
              </p>
              <button
                className="mt-5 animate-pulse rounded-full bg-orange-500 px-6
                  py-3 font-bold text-white shadow-lg hover:bg-orange-400
                  active:bg-orange-600"
                onClick={() => alert('BOOM! (Not really)')}
              >
                DO NOT CLICK!
              </button>
            </div>
          </div>
        </SectionContent>
      </Section>

      <Section>
        <SectionContent
          heading={data.generalContent.sectionTitleAvailableBikes}
        >
          {!isLoadingVehicles &&
            availableBikes &&
            availableBikes.length > 0 && (
              <>
                <div
                  className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2
                    lg:grid-cols-3"
                >
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
                {availableBikes &&
                  visibleItemsCount < availableBikes.length && (
                    <div className="mt-16 text-center">
                      <Button
                        variant="mutedSharp"
                        subVariant="rounded"
                        size="large"
                        className="border-border text-foreground hover:bg-muted
                          border px-8 py-3"
                        onClick={handleLoadMore}
                      >
                        Load more +
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
