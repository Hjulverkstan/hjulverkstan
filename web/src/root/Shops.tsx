import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { CardShop } from '@components/CardShop';
import { Page } from '@components/Page';
import { Shop } from '@data/webedit/shop/types';
import { Base, Body, Title } from '@components/Card';
import { ArrowRightIcon } from 'lucide-react';
import { IconLink } from '@components/shadcn/Button';
import { cn } from '@utils';

export default function Shops() {
  const { data } = usePreloadedDataLocalized();
  const allShops: Shop[] = data.shops;

  return (
    <Page heading={data.generalContent.shopsPageTitle} variant="default">
      <Section>
        <SectionContent>
          <div
            className={cn(
              'bg-muted relative flex flex-col overflow-hidden rounded-lg',
              ' md:p-10',
              'md:flex-row md:items-center',
            )}
          >
            <div className="w-full md:w-1/2 lg:p-8 lg:pr-12">
              <Base variant="muted" className="w-full max-w-[600px]">
                {data.generalContent.shopsWelcomeTitle && (
                  <Title>{data.generalContent.shopsWelcomeTitle}</Title>
                )}

                {data.generalContent.shopsWelcomeSubheading && (
                  <Body className="text-muted-foreground mb-2 mt-4">
                    {data.generalContent.shopsWelcomeSubheading}
                  </Body>
                )}

                {data.generalContent.shopsWelcomeBody && (
                  <Body className="mb-4">
                    {data.generalContent.shopsWelcomeBody}
                  </Body>
                )}

                {data.generalContent.shopButtonLabelAboutServices &&
                  '/services' && (
                    <div className="flex justify-start">
                      <IconLink
                        to="/services"
                        variant="background"
                        subVariant="rounded"
                        size="default"
                        text={data.generalContent.shopButtonLabelAboutServices}
                        icon={ArrowRightIcon}
                        iconRight
                      />
                    </div>
                  )}
              </Base>
            </div>

            <img
              src="/wrench.png"
              alt="Wrench icon"
              className="absolute z-10 hidden w-64 md:left-[45%] md:top-0
                md:block md:h-auto lg:left-[50%] xl:left-[50%]"
              aria-hidden="true"
            />
            <img
              src="/pump.png"
              alt="Pump icon"
              className="absolute hidden max-h-44 md:left-[45%] md:h-auto
                md:w-48 lg:bottom-[0rem] lg:left-[40%] lg:block lg:w-56 xl:w-64"
              aria-hidden="true"
            />
            <img
              src="/bike.png"
              alt="Bicycle frame"
              className="absolute hidden md:-bottom-0 md:-right-20 md:block
                md:h-[320px] md:w-[500px] lg:h-[320px] xl:-right-0 xl:h-[320px]"
              aria-hidden="true"
            />
          </div>
        </SectionContent>

        <SectionContent heading={data.generalContent.sectionTitleFindShop}>
          <div
            className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2 xl:grid
              xl:grid-cols-3"
          >
            {allShops.map((shop) => (
              <CardShop key={shop.id} shop={shop} />
            ))}
          </div>
        </SectionContent>
      </Section>
    </Page>
  );
}
