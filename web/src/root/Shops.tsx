import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { CardShop } from '@components/CardShop';
import { Page } from '@components/Page';
import { Shop } from '@data/webedit/shop/types';
import { CardDefault } from '@components/CardDefault';

export default function Shops() {
  const { data, currLocale } = usePreloadedDataLocalized();
  const allShops: Shop[] = data?.shops || [];

  return (
    <Page heading="Shops" showBreadcrumbs={true} variant="default">
      <Section className="!pb-0 !pt-8 md:!pt-12">
        <SectionContent>
          <div
            className="bg-muted relative mb-16 flex min-h-[280px] flex-col
              items-stretch overflow-hidden rounded-lg p-6 md:mb-24 md:min-h-0
              md:flex-row md:p-10"
          >
            <CardDefault
              className="max-w-[600px]"
              variant="muted"
              title="Welcome to Hjulverkstan"
              subHeading="Our services are free of charge"
              body="At our shops you can rent a bike, get your vehicle repaired, partake in our courses or just check in with us."
              link="/services"
              linkLabel="About our services"
              buttonVariant="background"
              buttonAlign="start"
            />

            <div
              className="flex hidden items-center justify-center md:relative
                md:block md:min-h-[280px] md:w-3/5 lg:min-h-[320px]"
            >
              <img
                src="/wrenchframe.png"
                alt="Wrench icon"
                className="absolute z-10 hidden md:left-1/4 md:top-[-3.5rem]
                  md:block md:h-auto md:w-48 lg:top-[-4rem] lg:w-64"
                aria-hidden="true"
              />
              <img
                src="/pumpframe.png"
                alt="Pump icon"
                className="md:left-1/5 absolute hidden md:bottom-[-3.5rem]
                  md:block md:h-auto md:w-48 lg:bottom-[-4rem] lg:w-64"
                aria-hidden="true"
              />
              <img
                src="/bikeframe.png"
                alt="Bicycle frame"
                className="absolute hidden md:-right-32 md:bottom-[-3.5rem]
                  md:block md:h-[400px] md:w-auto lg:bottom-[-4rem] lg:h-[400px]"
                aria-hidden="true"
              />
            </div>
          </div>
        </SectionContent>
      </Section>

      <Section className=" !pt-8 md:!pt-12">
        <SectionContent heading="Find a shop">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {allShops.map((shop) => (
              <CardShop
                key={shop.id}
                shop={shop}
                linkTo={`/${currLocale}/shops/${shop.id}`}
              />
            ))}
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
