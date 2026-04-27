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
    <span className="mb-8 font-bricolage text-stats-value !text-hjul-plum">
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
          className="relative z-10 mx-auto flex w-[88vw] flex-col items-center
              gap-4 sm:w-[76vw]"
        >
          <img
            src="/newlogo.svg"
            alt="Logo"
            className="mb-2 h-20 w-auto sm:mb-4 sm:h-44"
          />
          <h1 className="text-h1 !text-white text-background">Hjulverkstan</h1>
          <p
            className="text-h3 mt-2 max-w-[700px] !text-xl text-background
              sm:mt-4 sm:pr-0 sm:!text-3xl"
          >
            {data.text.slogan}
          </p>
        </div>
      </div>

      <Section variant="peach" className="relative w-full bg-cover bg-center">
        <SectionContent>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-4">
            {/* Borrow */}
            <ImageCard
              title={data.text.serviceRentTitle}
              body={data.text.serviceRentBody}
              image="borrow.jpg"
              ariaLabel="Learn more about how to borrow our bikes"
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
              image="cardLightPink.jpg"
              secondaryImage="bicycle.svg"
              secondImageVariant="fit"
              ariaLabel="Learn more about hor to repair your bike"
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
              image="courses.jpg"
              ariaLabel="Learn more about how to go on a course"
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
              secondaryImage="community.png"
              image="cardPink.jpg"
            />
          </div>
        </SectionContent>
      </Section>

      <Section variant={'lightPink'}>
        <SectionContent
          heading={t('shops')}
          linkTo="/shops"
          linkLabel={t('shopsLinkLabel')}
          className="[&_h2]:font-bricolage [&_h2]:text-display [&_h2]:font-bold
            [&_h2]:!text-hjul-dark"
          linkClassName="!flex !items-center !justify-start !bg-warm-gradient !text-hjul-soft !rounded-full !pl-5 !pr-2.5 !py-0 !gap-[7px] !h-10 !font-inter !text-[18px] !font-[500] !leading-7 [&_span]:!p-0"
        >
          <div
            className="grid grid-cols-1 gap-x-8 gap-y-12 md:hidden xl:grid
              xl:grid-cols-3"
          >
            {data.shops.slice(0, 3).map((shop) => (
              <CardShop
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
          className="[&_h2]:font-bricolage [&_h2]:text-display [&_h2]:font-bold
            [&_h2]:!text-hjul-dark"
          linkClassName="!flex !items-center !bg-blue-gradient !text-hjul-soft !rounded-full !pl-5 !pr-2.5 !py-0 !gap-[2px] !h-10 !gap-[7px] !font-inter !text-[18px] !font-[500] !leading-7 [&_span]:!p-0"
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

      <Section variant={'pink'}>
        <SectionContent>
          <div
            className="mb-25 grid grid-cols-1 gap-12 text-center md:grid-cols-3"
          >
            <div className="flex flex-col items-center">
              <img
                src="/bicycle.svg"
                className="mb-7 h-[183.7px] w-[209px]"
                alt="Bike"
              />
              <h3
                className="mb-2 self-stretch text-2xl font-semibold
                  text-hjul-plum"
              >
                The joy of riding, for everyone.
              </h3>
              <p
                className="max-w-[450px] text-lg font-medium leading-7
                  text-hjul-plum"
              >
                We believe everyone should have the ability to ride – with
                access to learning, free services and bikes for borrowing.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="/collaboration.svg"
                className="mb-7 h-[183.7px] w-[209px]"
                alt="Collaboration"
              />
              <h3
                className="mb-2 self-stretch text-2xl font-semibold
                  text-hjul-plum"
              >
                Built on collaboration.
              </h3>
              <p
                className="max-w-[450px] text-lg font-medium leading-7
                  text-hjul-plum"
              >
                A combined effort by public, private and non-profit sector – key
                partners such as Save the Children, Poseidon, Göteborgs Stad and
                more.
              </p>
            </div>

            <div className="flex flex-col items-center">
              <img
                src="/motion.svg"
                className="mb-7 h-[183.7px] w-[209px]"
                alt="In motion"
              />
              <h3
                className="text-align-center mb-2 self-stretch text-2xl
                  font-semibold text-hjul-plum"
              >
                Already in motion.
              </h3>
              <p
                className="max-w-[450px] text-lg font-medium leading-7
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
          <div
            className="flex flex-col items-center justify-center gap-x-32
              gap-y-24 sm:grid sm:grid-cols-2 sm:px-16 md:px-36
              min-[1200px]:flex min-[1200px]:flex-row
              min-[1200px]:items-baseline min-[1200px]:px-0"
          >
            <Statistic label={t('statsBikesRepaired')} value={628} />
            <Statistic label={t('statsBikesSaved')} value={500} />
            <Statistic label={t('statsBikesLent')} value={86} />
            <Statistic label={t('statsEmployeesHired')} value={30} />
          </div>
        </SectionContent>
      </Section>

      <div className="border-divider w-full border-t"></div>

      <Section variant="blue" className="relative w-full bg-cover bg-center">
        <SectionContent>
          <div
            className="mx-auto grid w-fit grid-cols-1 justify-center gap-8
              sm:grid-cols-2 xl:grid-cols-3"
          >
            {/* Work with us */}
            <ImageCard
              title={data.text.supportWorkTitle}
              body={data.text.supportWorkBody}
              baseClassName={true}
              image="work.jpg"
              ariaLabel="Learn more about donating via Swish"
            />
            {/* Material */}
            <ImageCard
              title={data.text.supportDonateMaterialTitle}
              body={data.text.supportDonateMaterialBody}
              image="donate.jpg"
              variant="brown"
              className="text-brown"
              baseClassName={true}
              ariaLabel="Learn more about hor to repair your bike"
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
              title={data.text.supportPartnerTitle}
              body={data.text.supportPartnerBody}
              baseClassName={true}
              image="partner.jpg"
              ariaLabel="Learn more about becoming a partner"
              link="/contact"
            />
          </div>
        </SectionContent>
      </Section>

      <Section variant="muted">
        <SectionContent
          heading={t('partnerHeading')}
          linkTo="/partners"
          linkLabel={t('partnerLinkLabel')}
          linkVariant="background"
        >
          <GridBetween rows={2} cols={4} className="hidden lg:flex">
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
