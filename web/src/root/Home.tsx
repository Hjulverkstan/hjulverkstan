import { Link } from 'react-router-dom';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { Card } from '@components/Card';
import { Section } from '@components/Section';
import { Button } from '@components/shadcn/Button';
import {
  Wrench,
  CalendarDays,
  TrafficCone,
  Bike,
  ArrowRight,
  HeartHandshake,
  Hammer,
  CoinsIcon,
  PackagePlusIcon,
  Pin,
} from 'lucide-react';
import Statistics from '@components/Statistics';
import { ShopAddress } from '@components/ShopAddress';
import { PartnersSection } from '@components/PartnersSection';

export default function Home() {
  const { data, locales } = usePreloadedDataLocalized();

  const statsData = [
    { value: 628, label: 'Bikes repaired' },
    { value: 500, label: 'Bikes saved' },
    { value: 86, label: 'Bikes lent' },
    { value: 20, label: 'Employees hired' },
  ];

  return (
    <>
      <div
        className="relative flex min-h-[60vh] w-full flex-col items-center
          justify-center bg-cover bg-center px-6 py-16 md:min-h-[80vh]
          md:items-start md:px-[170px]"
        style={{ backgroundImage: "url('/DSC07375.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-50" />
        <div
          className="relative z-10 flex flex-col items-center gap-4 text-center
            md:max-w-[832px] md:items-start md:text-left"
        >
          <div className="mb-4 flex gap-3 md:gap-4">
            <img
              src="/bikeicon1.svg"
              alt="Bike Icon"
              className="h-6 w-6 md:h-10 md:w-10"
            />
            <img
              src="/toolsicon1.svg"
              alt="Tools Icon"
              className="h-6 w-6 md:h-10 md:w-10"
            />
            <img
              src="/pumpicon1.svg"
              alt="Pump Icon"
              className="h-6 w-6 md:h-10 md:w-10"
            />
          </div>
          <h1
            className="font-['Inter'] text-4xl font-semibold text-white
              md:text-[80px] md:leading-[80px] md:tracking-[-0.96px]"
          >
            Hjulverkstan
          </h1>
          <p
            className="text-base leading-relaxed text-white md:max-w-[600px]
              md:text-xl"
          >
            A bike shop that changes lives – we bridge gaps and foster
            community.
          </p>
        </div>
      </div>

      <Section variant="gray">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card.Base>
            <Card.Icon icon={Wrench} />
            <Card.Title>Get a repair</Card.Title>
            <Card.Body>
              We offer repairs free of charge for bicycles, strollers, scooters
              and skateboards.
            </Card.Body>
            <Button
              asChild
              variant="roundedPrimary"
              aria-label="Learn more about repairs"
            >
              <Link to="/">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card.Base>

          <Card.Base>
            <Card.Icon icon={CalendarDays} />
            <Card.Title>Rent a bike</Card.Title>
            <Card.Body>
              Children and adults can borrow bicycles for a period of 1–2 weeks.
            </Card.Body>
            <Button
              asChild
              variant="roundedPrimary"
              className="ml-auto mt-4 h-8 w-8 p-0"
              aria-label="Learn more about bike rental"
            >
              <Link to="/">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card.Base>

          <Card.Base>
            <Card.Icon icon={TrafficCone} />
            <Card.Title>Learn to ride</Card.Title>
            <Card.Body>
              Join one of our free cycling courses for children and adults.
            </Card.Body>
            <Button
              asChild
              variant="roundedPrimary"
              className="ml-auto mt-4 h-8 w-8 p-0"
              aria-label="Learn more about cycling courses"
            >
              <Link to="/">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </Card.Base>

          <Card.Base>
            <Card.Icon icon={Bike} />
            <Card.Title>Join the community</Card.Title>
            <Card.Body>
              We create a safe environment for people to meet, accessible to
              everyone.
            </Card.Body>
            <Button variant="roundedPrimary" asChild>
              <Link to="/join-us">
                Work with us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card.Base>
        </div>

        <div className="flex w-full flex-col pb-4 pt-[140px]">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Stories</h2>
            <Link
              to="/stories"
              className="flex items-center gap-1 whitespace-nowrap rounded-full
                bg-white px-3 py-1 font-semibold text-black transition-colors
                hover:bg-gray-50"
            >
              See all stories
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="flex flex-col gap-8 md:flex-row md:gap-8 lg:gap-8">
            <div className="flex flex-col gap-8 md:basis-4/5 md:flex-row">
              <Card.Base variant="imageOverlay">
                <Card.Image
                  variant="background"
                  src="/DSC07375.jpg"
                  alt="Shop interior showing bikes and equipment"
                ></Card.Image>
                <Card.Title variant="imageOverlay">
                  New shop opens in Hjällbo
                </Card.Title>
                <Card.Row>
                  <Card.Body variant="imageOverlay">
                    Why support us? Your generosity directly supports
                    initiatives that make cycling accessible to all. Whether
                    it's...
                  </Card.Body>
                  <Button
                    asChild
                    variant="roundedContrast"
                    className="ml-auto h-8 w-8 p-0"
                    aria-label="Learn more about the new shop in Hjällbo"
                  >
                    <Link to="/">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card.Row>
              </Card.Base>
              <Card.Base variant="imageOverlay">
                <Card.Image
                  variant="background"
                  src="/DSC07375.jpg"
                  alt="Shop interior showing bikes and equipment"
                ></Card.Image>
                <Card.Title variant="imageOverlay">
                  New shop opens in Hjällbo
                </Card.Title>
                <Card.Row>
                  <Card.Body variant="imageOverlay">
                    With our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    that
                  </Card.Body>
                  <Button
                    asChild
                    variant="roundedContrast"
                    className="ml-auto h-8 w-8 p-0"
                    aria-label="Learn more about the new shop in Hjällbo"
                  >
                    <Link to="/">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card.Row>
              </Card.Base>
            </div>
            <div className="flex flex-col gap-4 md:basis-1/5">
              <Card.Base variant="compact">
                <Card.Title>IKEA rebuilds our latest shop...</Card.Title>
                <Card.Row>
                  <Card.Body variant="compact">
                    With our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    that
                  </Card.Body>
                  <Button
                    asChild
                    variant="roundedMuted"
                    className="ml-auto h-8 w-8 p-0"
                    aria-label="Learn more about the IKEA collaboration"
                  >
                    <Link to="/">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card.Row>
              </Card.Base>
              <Card.Base variant="compact">
                <Card.Title>140 bikes saved this month</Card.Title>
                <Card.Row>
                  <Card.Body variant="compact">
                    With our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    thatWith our new opening we needed to improve the someting
                    that
                  </Card.Body>
                  <Button
                    asChild
                    variant="roundedMuted"
                    className="ml-auto h-8 w-8 p-0"
                    aria-label="Learn more about saved bikes"
                  >
                    <Link to="/">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </Card.Row>
              </Card.Base>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col pb-16 pt-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Shops</h2>
            <Link
              to="/shops"
              className="flex items-center gap-1 whitespace-nowrap rounded-full
                bg-gray-100 px-3 py-1 font-semibold text-black transition-colors
                hover:bg-gray-200"
            >
              See all shops
              <ArrowRight size={16} strokeWidth={2.5} />
            </Link>
          </div>
          <div
            className="flex w-full flex-wrap justify-center gap-8 md:gap-8
              lg:gap-8"
          >
            <Card.Base variant="imageAbove">
              <Card.Image
                variant="inline"
                src="/DSC07375.jpg"
                alt="Shop interior showing bikes and equipment"
              ></Card.Image>
              <Card.Title>Hjällbo</Card.Title>
              <ShopAddress
                icon={Pin}
                address="Skolspåret 15, 424 31 Angered"
                isOpen={true}
              />
            </Card.Base>
            <Card.Base variant="imageAbove">
              <Card.Image
                variant="inline"
                src="/DSC07833.jpg"
                alt="Interior detail of a shop"
              />
              <Card.Title>Angered</Card.Title>
              <ShopAddress
                icon={Pin}
                address="Skolspåret 15, 424 31 Angered"
                isOpen={true}
              />
            </Card.Base>
            <Card.Base variant="imageAbove">
              <Card.Image
                variant="inline"
                src="/DSC07811.jpg"
                alt="Another shop detail or exterior"
              />
              <Card.Title>Biskopsgården</Card.Title>
              <ShopAddress
                icon={Pin}
                address="Skolspåret 15, 424 31 Angered"
                isOpen={true}
              />
            </Card.Base>
          </div>
        </div>
        <Statistics stats={statsData} />
      </Section>

      <Section>
        <div className="mx-auto flex w-full flex-col gap-8 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-gray-900">Get involved</h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <Card.Base variant="baseGray">
              <Card.Icon icon={PackagePlusIcon} />
              <Card.Title>Donate material</Card.Title>
              <Card.Body>
                Support us with bikes, tools, or other useful items. Your
                donation helps keep the project rolling.
              </Card.Body>
              <Button
                asChild
                variant="roundedPrimary"
                className="ml-auto mt-auto h-8 w-8 p-0"
                aria-label="Learn more about donating material"
              >
                <Link to="/">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card.Base>
            <Card.Base variant="baseGray">
              <Card.Icon icon={CoinsIcon} />
              <Card.Title>Donate via Swish</Card.Title>
              <Card.Body>
                Make a donation via Swish; every krona helps us empower young
                people and build a stronger community.
              </Card.Body>
              <Button
                asChild
                variant="roundedPrimary"
                className="ml-auto mt-auto h-8 w-8 p-0"
                aria-label="Learn more about donating via Swish"
              >
                <Link to="/">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card.Base>
            <Card.Base variant="baseGray">
              <Card.Icon icon={Hammer} />
              <Card.Title>Work with us</Card.Title>
              <Card.Body>
                We offer opportunities to get involved, learn new skills, and be
                part of our workshops.
              </Card.Body>
              <Button
                asChild
                variant="roundedPrimary"
                className="ml-auto mt-auto h-8 w-8 p-0"
                aria-label="Learn more about working with us"
              >
                <Link to="/">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card.Base>
            <Card.Base variant="baseGray">
              <Card.Icon icon={HeartHandshake} />
              <Card.Title>Become a partner</Card.Title>
              <Card.Body>
                We welcome partnerships that promote sustainability and
                inclusion. Feel free to reach out!
              </Card.Body>
              <Button
                asChild
                variant="roundedPrimary"
                className="ml-auto mt-auto h-8 w-8 p-0"
                aria-label="Learn more about becoming a partner"
              >
                <Link to="/">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </Card.Base>
          </div>
        </div>
      </Section>

      <Section variant="gray">
        <PartnersSection />
      </Section>

      <div className="flex w-full flex-col gap-8 p-4">
        <h2 className="text-xl font-semibold">Hjulverkstan</h2>
        <div className="flex gap-2">
          {locales.map((locale) => (
            <Link className="font-bold" key={locale} to={`/${locale}`}>
              {locale}
            </Link>
          ))}
        </div>
        <Link className="font-bold" to="/portal">
          Go to Portal
        </Link>
        <p>{data?.generalContent?.slogan || 'Loading slogan...'}</p>
        {data?.shop?.map((shop) => (
          <div key={shop.id}>
            <h3 className="text-lg font-semibold">{shop.name}</h3>
            <p>{shop.bodyText}</p>
          </div>
        ))}
      </div>
    </>
  );
}
