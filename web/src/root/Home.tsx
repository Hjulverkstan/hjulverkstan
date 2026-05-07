import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import { CardStory } from '@components/CardStory';
import { CardCompact } from '@components/CardCompact';
import { CardShop } from '@components/CardShop';
import { Partner, partners } from './tempData';
import { GridBetween } from '@components/GridBetween';
import { Page } from '@components/Page';
import { useDialogManager } from '@components/DialogManager';
import { useTranslations } from '@hooks/useTranslations';

import {
  ServicesAsDialogWrapper,
  ServicesHowToRentView,
  ServicesJoinCourseView,
  ServicesRepairCardView,
} from './Services';
import { TiptapContentAsText } from '@components/TiptapContentAsText';
import { ImageCard } from '@components/ImageCard';

const Statistic = ({ label, value }: { label: string; value: number }) => (
  <div className="flex h-full flex-col items-center justify-start text-center">
    <span
      className="mb-1 font-bricolage text-stats-value !text-hjul-plum md:mb-8"
    >
      {value}
    </span>
    <span className="text-h3 font-bold text-foreground text-hjul-plum">
      {label}
    </span>
  </div>
);

const PartnerImg = ({ partner }: { partner: Partner }) => (
  <img
    src={partner.src}
    alt={partner.name}
    className="max-h-20 w-auto min-w-0 max-w-64 flex-shrink object-contain
      md:max-w-52"
  />
);

//

export default function Home() {
  const { data } = usePreloadedDataLocalized();
  const { openDialog } = useDialogManager();

  const { t } = useTranslations();

  return (
    <Page hasHeroSection>
      <div
        className="light relative flex w-full flex-col items-center
          justify-center bg-hero bg-cover bg-center py-24 md:h-[70vh]
          md:max-h-[40rem] md:items-start lg:-mt-20 lg:h-[83vh] lg:max-h-[83vh]"
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url('/grain.png')",
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
            zIndex: 0,
          }}
        />
        <div
          className="relative z-10 mx-auto flex w-[88vw] flex-col items-center
            gap-4 sm:w-[76vw]"
        >
          <img
            src="/newlogo.svg"
            alt="Logo"
            className="mb-2 h-32 w-auto sm:mb-4 sm:h-44"
          />
          <h1 className="text-h1 !text-white text-background">Hjulverkstan</h1>
          <p
            className="text-h2 mt-2 max-w-[700px] !text-xl !text-white
              text-background sm:mt-4 sm:pr-0 sm:!text-3xl"
          >
            {data.text.slogan}
          </p>
        </div>
      </div>

      <Section
        variant="peach"
        className="relative w-full bg-cover bg-center md:pt-32"
        grain
      >
        <SectionContent>
          <div
            className="mx-auto grid w-fit grid-cols-1 justify-center gap-8
              md:grid-cols-2 2xl:grid-cols-4"
          >
            {/* Borrow */}
            <ImageCard
              title={data.text.serviceRentTitle}
              body={data.text.serviceRentBody}
              image="/borrow.jpg"
              ariaLabel="Learn more about how to borrow our bikes"
              alt="Borrow bikes"
              onClick={() =>
                openDialog(
                  <ServicesAsDialogWrapper>
                    <ServicesHowToRentView mode="dialog" />
                  </ServicesAsDialogWrapper>,
                )
              }
            />
            {/* Repair */}
            <ImageCard
              title={data.text.serviceRepairTitle}
              body={data.text.serviceRepairBody}
              variant="pink"
              image="/cardLightPink.jpg"
              secondaryImage="/bicycle.svg"
              secondImageVariant="fit"
              ariaLabel="Learn more about hor to repair your bike"
              alt="Repair bikes"
              onClick={() =>
                openDialog(
                  <ServicesAsDialogWrapper>
                    <ServicesRepairCardView mode="dialog" />
                  </ServicesAsDialogWrapper>,
                )
              }
            />
            {/* Courses */}
            <ImageCard
              title={data.text.serviceCoursesTitle}
              body={data.text.serviceCoursesBody}
              image="/courses.jpg"
              ariaLabel="Learn more about how to go on a course"
              alt="Courses"
              onClick={() =>
                openDialog(
                  <ServicesAsDialogWrapper>
                    <ServicesJoinCourseView mode="dialog" />
                  </ServicesAsDialogWrapper>,
                )
              }
            />
            {/* Community */}
            <ImageCard
              title={data.text.serviceCommunityTitle}
              body={data.text.serviceCommunityBody}
              variant="multiple"
              secondImageVariant="fullBleed"
              linkLabel={t('communityLinkLabel')}
              ariaLabel="Learn more about joining our community"
              secondaryImage="/community.png"
              image="/cardPink.jpg"
              alt="Community"
            />
          </div>
        </SectionContent>
      </Section>

      <Section variant={'lightPink'} className="md:pt-32" grain>
        <SectionContent
          heading={t('shops')}
          linkTo="/shops"
          linkLabel={t('shopsLinkLabel')}
          linkClassName="!flex !items-center !justify-start !bg-warm-gradient !text-hjul-soft !rounded-full !pl-5 !pr-2.5 !py-0 !gap-[7px] !h-10 !font-inter !text-[18px] !font-[500] !leading-7 [&_span]:!p-0 mt-2 md:mt-0"
        >
          <div
            className="grid grid-cols-1 gap-x-8 gap-y-12 md:hidden xl:grid
              xl:grid-cols-3"
          >
            {data.shops.slice(0, 3).map((shop) => (
              <CardShop
                key={shop.id}
                shop={shop}
                className="!bg-transparent text-hjul-dark !shadow-none
                  [&_h2]:font-normal [&_p]:text-hjul-muted
                  [&_span]:text-hjul-muted [&_svg]:text-hjul-muted"
              />
            ))}
          </div>
          <div
            className="hidden gap-x-8 gap-y-12 md:grid md:grid-cols-2 xl:hidden"
          >
            {data.shops.slice(0, 4).map((shop) => (
              <CardShop
                key={shop.id}
                shop={shop}
                className="!bg-transparent text-hjul-dark !shadow-none
                  [&_h2]:font-normal [&_p]:text-hjul-muted
                  [&_span]:text-hjul-muted [&_svg]:text-hjul-muted"
              />
            ))}
          </div>
        </SectionContent>

        <SectionContent
          heading={t('updates')}
          linkTo="/stories"
          linkLabel={t('storiesLinkLabel')}
          linkVariant="background"
          linkClassName="!flex !items-center !bg-blue-gradient !text-hjul-soft
          !rounded-full !pl-5 !pr-2.5 !py-0 !gap-[2px] !h-10 !gap-[7px]
          !font-inter !text-[18px] !font-[500] !leading-7 [&_span]:!p-0 mt-2 md:mt-0"
        >
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
            <div className="flex flex-col gap-8 md:basis-3/4 md:flex-row">
              {data.stories.slice(0, 2).map((story) => (
                <CardStory
                  key={story.id}
                  story={story}
                  className="h-96 border border-black/10 !shadow-pink-blur
                    xl:h-96"
                />
              ))}
            </div>
            <div className="flex flex-col justify-start gap-8 md:basis-1/4">
              {data.stories.slice(2, 4).map((story) => (
                <CardCompact
                  key={story.id}
                  title={story.title}
                  body={<TiptapContentAsText content={story.bodyText} />}
                  link={`/stories/${story.slug}`}
                  ariaLabel={story.title}
                  className="z-10 border border-black/10 !bg-[#FFFFFF]
                    text-hjul-dark !shadow-pink-blur"
                />
              ))}
            </div>
          </div>
        </SectionContent>
      </Section>

      <Section variant={'pink'} className="md:pt-32" grain>
        <SectionContent>
          <div
            className="mb-25 grid grid-cols-1 gap-12 text-center md:grid-cols-3"
          >
            <div className="flex flex-col items-center gap-2.5">
              <img
                src="/bicycle.svg"
                className="mb-2 h-[183.7px] w-[209px] md:mb-9 md:h-[183.7px]
                  md:w-[209px]"
                alt="Bike"
              />
              <h3 className="text-hjul-plum">
                The joy of riding, for everyone.
              </h3>
              <p
                className="max-w-[450px] text-lg font-semibold leading-7
                  text-hjul-plum"
              >
                We believe everyone should have the ability to ride – with
                access to learning, free services and bikes for borrowing.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2.5">
              <img
                src="/collaboration.svg"
                className="scale-120 mb-0 mt-2 h-[165px] w-[209px] md:mb-9
                  md:mt-0 md:h-[183.7px] md:w-[209px] md:scale-100"
                alt="Collaboration"
              />
              <h3 className="text-hjul-plum">Built on collaboration.</h3>
              <p
                className="mb-2 max-w-[450px] text-lg font-semibold leading-7
                  text-hjul-plum"
              >
                A combined effort by public, private and non-profit sector – key
                partners such as Save the Children, Poseidon, Göteborgs Stad and
                more.
              </p>
            </div>

            <div className="flex flex-col items-center gap-2.5">
              <img
                src="/motion.svg"
                className="mb-0 mt-2 h-[173.7px] w-[209px] md:mb-9 md:mt-0
                  md:h-[183.7px] md:w-[209px]"
                alt="In motion"
              />
              <h3 className="text-align-center text-hjul-plum">
                Already in motion.
              </h3>
              <p
                className="max-w-[450px] text-lg font-semibold leading-7
                  text-hjul-plum"
              >
                Five locations established in the Gothenburg area – and growing.
              </p>
            </div>
          </div>
        </SectionContent>

        <div className="w-full">
          <svg width="100%" height="2" className="block">
            <line
              x1="0"
              y1="1"
              x2="100%"
              y2="1"
              stroke="rgba(109, 2, 102, 0.5)"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          </svg>
        </div>

        <SectionContent>
          <div className="flex flex-col items-center">
            <p
              className="text-h3 text-center font-bricolage text-lg font-bold
                text-hjul-plum"
            >
              This year we've accomplished:
            </p>
          </div>
          <div
            className="mt-14 flex flex-col items-center justify-center gap-x-32
              gap-y-16 sm:grid sm:grid-cols-2 sm:px-16 md:mt-20 md:gap-y-24
              md:px-36 min-[1200px]:flex min-[1200px]:flex-row
              min-[1200px]:items-baseline min-[1200px]:px-0"
          >
            <Statistic label={t('statsBikesRepaired')} value={395} />
            <Statistic label={t('statsBikesSaved')} value={32} />
            <Statistic label={t('statsBikesLent')} value={46} />
            <Statistic label={t('statsEmployeesHired')} value={26} />
          </div>
        </SectionContent>
      </Section>

      <div className="border-divider w-full border-t"></div>

      <Section
        variant="blue"
        className="relative w-full bg-cover bg-center md:pt-32"
        grain
      >
        <SectionContent>
          <div
            className="mx-auto grid w-fit grid-cols-1 justify-center gap-8
              xl:grid-cols-3"
          >
            {/* Work with us */}
            <ImageCard
              className="md:h-[360px] md:max-w-none xl:h-[540px]
                xl:max-w-[390px]"
              title={data.text.supportWorkTitle}
              body={data.text.supportWorkBody}
              image="/work.jpg"
              ariaLabel="Learn more about donating via Swish"
              alt="Work with us"
            />
            {/* Material */}
            <ImageCard
              className="text-brown md:h-[360px] md:max-w-none xl:h-[540px]
                xl:max-w-[390px] md:[&_img]:relative md:[&_img]:-top-32
                md:[&_img]:h-auto xl:[&_img]:absolute xl:[&_img]:top-0
                xl:[&_img]:h-full"
              title={data.text.supportDonateMaterialTitle}
              body={data.text.supportDonateMaterialBody}
              image="/donate.jpg"
              variant="brown"
              ariaLabel="Learn more about hor to repair your bike"
              alt="Material"
              onClick={() =>
                openDialog(
                  <ServicesAsDialogWrapper>
                    <ServicesRepairCardView mode="dialog" />
                  </ServicesAsDialogWrapper>,
                )
              }
            />
            {/* Partner */}
            <ImageCard
              className="md:h-[360px] md:max-w-none xl:h-[540px]
                xl:max-w-[390px]"
              title={data.text.supportPartnerTitle}
              body={data.text.supportPartnerBody}
              image="/partner.jpg"
              ariaLabel="Learn more about becoming a partner"
              to="/contact"
              alt="Partner"
            />
          </div>
        </SectionContent>
      </Section>

      <Section variant="mutedFooter" className="md:pt-32 lg:pb-40">
        <SectionContent heading={t('partnerHeading')}>
          <GridBetween rows={1} cols={5} className="hidden lg:flex">
            {partners.map((partner, index) => (
              <PartnerImg key={index} partner={partner} />
            ))}
          </GridBetween>

          <GridBetween
            rows={2}
            cols={3}
            className="hidden min-[700px]:flex lg:hidden"
          >
            {partners.map((partner, index) => (
              <PartnerImg key={index} partner={partner} />
            ))}
          </GridBetween>

          <GridBetween
            rows={3}
            cols={2}
            className="flex min-[700px]:hidden"
            rowClassName="gap-16"
          >
            {partners.map((partner, index) => (
              <PartnerImg key={index} partner={partner} />
            ))}
          </GridBetween>
        </SectionContent>
      </Section>
    </Page>
  );
}
