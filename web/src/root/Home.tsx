import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { Section } from '@components/Section';
import { SectionContent } from '@components/SectionContent';
import {
  Wrench,
  CalendarDays,
  TrafficCone,
  Bike,
  HeartHandshake,
  Hammer,
  CoinsIcon,
  PackagePlusIcon,
} from 'lucide-react';
import { Shop } from '@data/webedit/shop/types';
import { CardDefault } from '@components/CardDefault';
import { CardImage } from '@components/CardImage';
import { CardCompact } from '@components/CardCompact';
import { CardImageAbove } from '@components/CardImageAbove';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

const statsData = [
  { value: 628, label: 'Bikes repaired' },
  { value: 500, label: 'Bikes saved' },
  { value: 86, label: 'Bikes lent' },
  { value: 20, label: 'Employees hired' },
];

const partners = [
  { name: 'Familjebostäder', src: '/familjebostader.png' },
  { name: 'Poseidon', src: '/poseidon.png' },
  { name: 'Bostadsbolaget', src: '/bostadsbolaget.png' },
  { name: 'Framtiden', src: '/framtiden.png' },
  { name: 'Alten', src: '/alten2.svg' },
  { name: 'Göteborgsstad', src: '/goteborgstad.svg' },
  { name: 'Volvo', src: '/volvo.svg' },
  { name: 'Familjebostäder', src: '/familjebostader.png' },
];

const stories = [
  {
    id: '1',
    imageURL: '/DSC07375.jpg',
    title: 'New shop opens in Hjällbo',
    bodyText:
      "Why support us? Your generosity directly supports initiatives that make cycling accessible to all. Whether it's...",
    link: '/',
    ariaLabel: 'Learn more about the new shop in Hjällbo',
  },
  {
    id: '2',
    imageURL: '/DSC07375.jpg',
    title: 'New shop opens in Hjällbo',
    bodyText:
      "Why support us? Your generosity directly supports initiatives that make cycling accessible to all. Whether it's...",
    link: '/',
    ariaLabel: 'Learn more about this story',
  },
  {
    id: '3',
    title: 'IKEA rebuilds our latest shop.arhogun awrhg åoawin ..',
    bodyText:
      'With our new opening we needed to improve the someting thatWith our new opening we needed to improve the someting...',
    link: '/',
    ariaLabel: 'Learn more about the IKEA collaboration',
  },
  {
    id: '4',
    title: '140 bikes saved this month',
    bodyText:
      'With our new opening we needed to improve the someting thatWith our new opening we needed to improve the someting...',
    link: '/',
    ariaLabel: 'Learn more about saved bikes',
  },
];

export default function Home() {
  const { data } = usePreloadedDataLocalized();
  const shops: Shop[] = data?.shop || [];

  return (
    <>
      <Navbar />

      <div
        className="relative flex min-h-[804px] w-full flex-col items-center
          justify-center bg-cover bg-center px-6 py-16 md:items-start
          md:px-[170px]"
        style={{ backgroundImage: "url('/DSC07375.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60" />

        <div
          className="relative z-10 flex flex-col items-center gap-4 text-center
            md:max-w-[832px] md:items-start md:text-left"
        >
          <div className="mb-6 flex items-center gap-9">
            <img src="/bikeicon1.svg" alt="Bike Icon" className="h-16 w-auto" />
            <img
              src="/toolsicon1.svg"
              alt="Tools Icon"
              className="h-16 w-auto"
            />
            <img src="/pumpicon1.svg" alt="Pump Icon" className="h-16 w-auto" />
          </div>

          <h1
            className="font-inter text-background text-4xl font-semibold
              md:text-[80px] md:leading-[80px] md:tracking-[-0.96px]"
          >
            Hjulverkstan
          </h1>

          <p className="text-h3 text-background md:max-w-[600px]">
            A bike shop that changes lives – we bridge gaps and somthing like
            so.
          </p>
        </div>
      </div>

      <Section variant="gray">
        <SectionContent>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <CardDefault
              icon={Wrench}
              title="Get a repair"
              body="We offer repairs free of charge for bicycles, strollers, scooters and skateboards."
              link="/"
              ariaLabel="Learn more about repairs"
            />
            <CardDefault
              icon={CalendarDays}
              title="Rent a bike"
              body="Children and adults can borrow bicycles for a period of 1–2 weeks."
              link="/"
              ariaLabel="Learn more about bike rental"
            />
            <CardDefault
              icon={TrafficCone}
              title="Learn to ride"
              body="Join one of our free cycling courses for children and adults."
              link="/"
              ariaLabel="Learn more about cycling courses"
            />
            <CardDefault
              icon={Bike}
              title="Join a community"
              body="We create a safe environment for people to meet, accessible to everyone."
              link="/join-us"
              ariaLabel="Learn more about joining the community"
              linkLabel="Work with us"
            />
          </div>
        </SectionContent>

        <SectionContent
          className="mt-[140px]"
          heading="Stories"
          linkTo="/stories"
          linkLabel="See all stories"
        >
          <div className=" flex flex-col gap-8 md:flex-row md:gap-8 lg:gap-8">
            <div className="flex flex-col gap-8 md:basis-4/5 md:flex-row">
              {stories.slice(0, 2).map((story) => (
                <CardImage
                  key={story.id}
                  imageSrc={story.imageURL || '/DSC07375.jpg'}
                  imageAlt={story.title}
                  title={story.title}
                  body={story.bodyText}
                  link={story.link}
                  ariaLabel={story.ariaLabel}
                />
              ))}
            </div>
            <div className="flex flex-col gap-8 md:basis-1/4">
              {stories.slice(2, 4).map((story) => (
                <CardCompact
                  key={story.id}
                  title={story.title}
                  body={story.bodyText}
                  link={story.link}
                  ariaLabel={story.ariaLabel}
                />
              ))}
            </div>
          </div>
        </SectionContent>
      </Section>

      <Section>
        <SectionContent
          heading="Shops"
          linkTo="/shops"
          linkLabel="See all shops"
          linkVariant="roundedMutedText"
        >
          <div
            className="flex w-full flex-wrap justify-start gap-8 md:gap-8
              lg:gap-8"
          >
            {shops.slice(0, 3).map((shop) => {
              return (
                <CardImageAbove
                  key={shop.id}
                  imageSrc={shop.imageURL}
                  title={shop.name}
                  address={shop.address}
                  imageAlt={shop.name}
                  openHours={shop.openHours}
                />
              );
            })}
          </div>
        </SectionContent>
      </Section>

      <div className="border-divider w-full border-t"></div>

      <Section>
        <SectionContent>
          <div
            className="flex flex-wrap items-baseline justify-center gap-x-36
              gap-y-8"
          >
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center"
              >
                <span
                  className="text-primary mb-8 text-[100px] font-bold
                    leading-[75px]"
                >
                  {stat.value}
                </span>
                <span className="text-h3 text-foreground font-bold">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </SectionContent>
      </Section>

      <div className="border-divider w-full border-t"></div>

      <Section>
        <SectionContent heading="Join us">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <CardDefault
              icon={PackagePlusIcon}
              title="Donate material"
              body="Support us with bikes, tools, or other useful items. Your donation helps keep the project rolling."
              link="/"
              ariaLabel="Learn more about donating material"
              variant="baseGray"
            />
            <CardDefault
              icon={CoinsIcon}
              title="Donate via Swish"
              body="Swish a contribution, every bit helps us empower young people and build a stronger community."
              link="/"
              ariaLabel="Learn more about donating via Swish"
              variant="baseGray"
            />
            <CardDefault
              icon={Hammer}
              title="Work with us"
              body="We offer opportunities to get involved, learn new skills, and be part of our workshops."
              link="/"
              ariaLabel="Learn more about working with us"
              variant="baseGray"
            />
            <CardDefault
              icon={HeartHandshake}
              title="Become a partner"
              body="We welcome partnerships that promote sustainability and inclusion. Feel free to reach out!"
              link="/"
              ariaLabel="Learn more about becoming a partner"
              linkLabel="Contact us"
              variant="baseGray"
            />
          </div>
        </SectionContent>
      </Section>

      <Section variant="gray">
        <SectionContent
          heading="Our partners"
          linkTo="/partners"
          linkLabel="See all partners"
        >
          <div
            className="grid grid-cols-2 items-center justify-items-center
              gap-x-24 gap-y-[70px] sm:grid-cols-3 md:grid-cols-4"
          >
            {partners.map((partner, index) => (
              <img
                key={index}
                src={partner.src}
                alt={partner.name}
                className="max-h-20 w-auto object-contain lg:max-h-24"
              />
            ))}
          </div>
        </SectionContent>
      </Section>

      <Footer />
    </>
  );
}
