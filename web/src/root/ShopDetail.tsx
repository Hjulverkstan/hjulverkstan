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

const ITEMS_TO_LOAD = 6;

export default function ShopDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data } = usePreloadedDataLocalized();
  const shop = data.shops.find((shop: Shop) => shop.slug === slug)!;

  console.log(useParams());
  console.log({ slug, shop });

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
      heading={shop.name}
      headingSuffix={
        <OpenBadge
          className="mb-0 md:-translate-y-[13px]"
          openHours={shop.openHours}
          variant="large"
        />
      }
    >
      <Section className="!pb-8 !pt-8 md:!pt-12">
        <SectionContent>
          {shop.imageURL && (
            <div
              className="flex max-h-[659px] items-center justify-center
                overflow-hidden rounded-lg"
            >
              <img
                src={shop.imageURL}
                alt={`${shop.name} exteriör`}
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
              title={data.generalContent.shopDetailJustDropTitle}
              body={
                <>
                  <strong>
                    {data.generalContent.shopDetailJustDropBodyBold}
                  </strong>
                  {' ' + data.generalContent.shopDetailsJustDropBodyRegular}
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
          {vehiclesQ.data && (
            <>
              <div
                className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2
                  lg:grid-cols-3"
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
