import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@components/Card';
import { Section } from '@components/Section';
import { Button } from '@components/shadcn/Button';
import { ArrowRight, Clock, MapPin, Loader2 } from 'lucide-react';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';
import { useQuery } from '@tanstack/react-query';
import { createGetShopVehicles } from '@data/vehicle/api';
import { VehicleStatus } from '@data/vehicle/types';

export default function ShopDetail() {
  const { data: preloadedData } = usePreloadedDataLocalized();
  const { shopId } = useParams<{ shopId: string }>();

  const currentShop = preloadedData?.shop?.find(
    (shop) => String(shop.id) === shopId,
  );

  const {
    data: availableBikes,
    isLoading: isLoadingVehicles,
    isError: isErrorVehicles,
  } = useQuery({
    ...createGetShopVehicles({
      shopId: shopId!,
      status: VehicleStatus.AVAILABLE,
    }),
    enabled: !!shopId,
    staleTime: 5 * 60 * 1000,
  });

  if (!currentShop) {
    return <div>Shop not found.</div>;
  }

  const formattedOpenHours = 'Mån 10:00-18:00, Tis 14:00-18:00';
  const isOpen = currentShop.isOpen === undefined ? true : currentShop.isOpen;

  return (
    <>
      <Section>
        {' '}
        <div className="px-4 md:px-0">
          <div className="mb-4 flex items-center gap-4">
            <h1 className="text-h1 font-semibold">{currentShop.name}</h1>
            {isOpen ? (
              <span
                className="inline-flex items-center rounded-full bg-green-100
                  px-3 py-0.5 text-sm font-medium text-green-800"
              >
                Open now
              </span>
            ) : (
              <span
                className="inline-flex items-center rounded-full bg-red-100 px-3
                  py-0.5 text-sm font-medium text-red-800"
              >
                Closed
              </span>
            )}
          </div>
        </div>
        <img
          src={currentShop.imageURL || '/placeholder-shop.jpg'}
          alt={`${currentShop.name} exterior`}
          className="-mx-4 h-[300px] w-full object-cover md:mx-0 md:h-[450px]"
        />
        <div
          className="grid grid-cols-1 items-start gap-8 px-4 py-8 md:grid-cols-3
            md:px-0 md:py-12"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600"
                aria-hidden="true"
              />
              <span className="text-base text-gray-700">
                {currentShop.address}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <Clock
                className="mt-1 h-5 w-5 flex-shrink-0 text-gray-600"
                aria-hidden="true"
              />
              <span className="text-base text-gray-700">
                {formattedOpenHours}
              </span>
            </div>
          </div>

          <div
            className="flex aspect-video items-center justify-center rounded-lg
              bg-gray-200 text-gray-500 md:aspect-square"
          >
            Map Placeholder
          </div>

          <Card.Base variant="baseGray">
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Just drop by for bike help
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-gray-600">
              No booking online. Hjulverkstan is an initiative by Save the
              Children to make biking accessible to everyone. To take part of
              our services come visit us!
            </p>
            <Button
              asChild
              variant="roundedContrast"
              aria-label="About our services"
            >
              <Link to="/services">
                About our services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card.Base>
        </div>
      </Section>{' '}
      <Section>
        <h2 className="text-h2 mb-8 font-semibold">Available bikes</h2>
        <div
          className="flex w-full flex-wrap justify-start gap-8 md:gap-8 lg:gap-8"
        >
          {isLoadingVehicles ? (
            <div className="flex w-full items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : isErrorVehicles ? (
            <p className="text-red-600">
              Failed to load bikes. Please try again later.
            </p>
          ) : availableBikes && availableBikes.length > 0 ? (
            availableBikes.map((bike) => (
              <Card.Base key={bike.id} variant="imageAbove" className="w-full">
                <Card.Image
                  variant="inline"
                  src={bike.imageURL || '/placeholder-bike.jpg'}
                  alt={`${bike.bikeType || ''} ${bike.brand || ''} ${bike.regTag || ''}`.trim()}
                  className="aspect-video"
                />
                <Card.Title>
                  {`${bike.bikeType || ''} ${bike.brand || ''} ${bike.regTag || ''}`.trim()}
                </Card.Title>
              </Card.Base>
            ))
          ) : (
            <p className="text-gray-600">
              No available bikes at this shop right now.
            </p>
          )}
        </div>
      </Section>
    </>
  );
}
