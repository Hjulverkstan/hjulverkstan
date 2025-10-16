import React from 'react';

import { ImageWithFallback } from '@components/ImageWithFallback';
import Error from '@components/Error';
import { endpoints } from '@data/api';
import { Vehicle } from '@data/vehicle/types';
import { Bike } from 'lucide-react';

export interface MobileInventoryVehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
}

export const MobileInventoryVehicleCard = ({
  vehicle,
  onClick,
}: MobileInventoryVehicleCardProps) => (
  <div
    className="flex w-full flex-col gap-6 hover:cursor-pointer"
    onClick={onClick}
  >
    <div
      className="border-border aspect-video overflow-hidden rounded-xl border
        bg-gray-100"
    >
      {vehicle.imageURL ? (
        <ImageWithFallback
          src={vehicle.imageURL}
          className="h-full w-full object-cover"
          fallback={
            <Error
              className="h-full"
              error={{ error: 'NOT_FOUND', endpoint: endpoints.image }}
            />
          }
        />
      ) : (
        <div
          className="text-muted-foreground/60 flex h-full items-center
            justify-center"
        >
          <Bike size={40} />
        </div>
      )}
    </div>
    <h3>{vehicle.isCustomerOwned ? `#${vehicle.id}` : vehicle.regTag}</h3>
  </div>
);
