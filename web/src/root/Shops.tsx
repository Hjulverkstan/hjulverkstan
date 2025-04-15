import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@components/Card';
import { Section } from '@components/Section';
import { Button } from '@components/shadcn/Button';
import { ShopAddress } from '@components/ShopAddress';
import { Pin, ArrowRight } from 'lucide-react';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

export default function Shops() {
  const { data, currLocale } = usePreloadedDataLocalized();
  const shops = data?.shop || [];

  return (
    <>
      <div className="px-4 py-8 md:px-[140px] md:py-12">
        <h1 className="text-h1 mb-10 font-semibold md:mb-12">Shops</h1>

        <div
          className="relative mb-16 flex min-h-[280px] flex-col items-stretch
            overflow-hidden rounded-lg bg-gray-100 p-6 md:mb-24 md:min-h-0
            md:flex-row md:p-10"
        >
          <div
            className="z-10 mb-6 flex flex-col justify-center md:mb-0 md:w-1/2
              md:pr-8"
          >
            <h2 className="text-h2 mb-4 font-semibold">
              Welcome to Hjulverkstan
            </h2>
            <p className="mb-6 text-lg leading-relaxed text-gray-700">
              Our services are free of charge. At our shops you can rent a bike,
              get your vehicle repaired, partake in our courses or just check in
              with us.
            </p>
            <Button
              asChild
              variant="roundedContrast"
              className="self-start"
              aria-label="About our services"
            >
              <Link to="/services">
                About our services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div
            className="hidden md:relative md:block md:min-h-[280px] md:w-1/2
              lg:min-h-[320px]"
          >
            <img
              src="/wrenchframe.png"
              alt="Wrench icon"
              className="absolute z-10 hidden md:left-1/4 md:top-[-2.5rem]
                md:block md:h-auto md:w-20 md:-translate-x-1/2 lg:top-[-2.5rem]
                lg:w-24"
              aria-hidden="true"
            />
            <img
              src="/pumpframe.png"
              alt="Pump icon"
              className="md:left-1/5 absolute hidden md:bottom-[-2.5rem]
                md:block md:h-auto md:w-20 md:-translate-x-1/2
                lg:bottom-[-2.5rem] lg:w-24"
              aria-hidden="true"
            />
            <img
              src="/bikeframe.png"
              alt="Bicycle frame"
              className=" lg:left-50 absolute hidden md:bottom-[-2.5rem]
                md:left-10 md:block md:h-56 md:w-auto lg:bottom-[-2.5rem]
                lg:left-64 lg:h-[280px]"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <Section>
        <h2 className="text-h2 mb-8 font-semibold">Find a shop</h2>
        <div
          className="flex w-full flex-wrap justify-start gap-8 md:gap-8 lg:gap-8"
        >
          {shops.map((shop) => (
            <Card.Base variant="imageAbove">
              <Card.Image variant="inline" src={shop.imageURL} alt={''} />
              <Link
                to={`/${currLocale}/shops/${shop.id}`}
                className="hover:underline"
              >
                <Card.Title>{shop.name}</Card.Title>
              </Link>
              <ShopAddress
                icon={Pin}
                address={shop.address}
                isOpen={shop.isOpen === undefined ? true : shop.isOpen}
              />
            </Card.Base>
          ))}
        </div>
      </Section>
    </>
  );
}
