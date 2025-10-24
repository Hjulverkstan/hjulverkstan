import { MapPin } from 'lucide-react';
import React from 'react';

import { OpenBadge } from '@components/OpenBadge';
import { Bullet } from '@components/Bullet';
import { Shop } from '@data/webedit/shop/types';
import { Base, Image, Title } from '@components/Card';
import { Link } from '@components/shadcn/Button';
import { VehiclePublic } from '@data/vehicle/types';
import { useTranslateRawEnums } from '@hooks/useTranslateRawEnums';
import * as enumsRaw from '@data/vehicle/enums';
import { findEnum } from '@utils/enums';

interface CardVehicleProps {
  shop: Shop;
  vehicle: VehiclePublic;
}

export const CardVehicle: React.FC<CardVehicleProps> = ({ shop, vehicle }) => {
  const enums = useTranslateRawEnums(enumsRaw);

  const titleLabel = `${findEnum(enums, vehicle.brand)?.label} ${findEnum(enums.vehicleType, vehicle.vehicleType)?.label}`;

  return (
    <Link
      to={`/vehicle/${vehicle.id}`}
      variant="link"
      className="-px-4 block h-full w-full text-current no-underline
        hover:no-underline focus:outline-none"
    >
      <Base variant="imageAbove">
        <Image
          variant="inline"
          className="aspect-video"
          src={vehicle.imageURL}
          alt={titleLabel}
        />
        <div className="flex flex-col gap-3">
          <Title>{titleLabel}</Title>
          <p className="text-foreground line-clamp-1 text-lg">{shop.name}</p>
          <Bullet icon={MapPin}>
            <span className="text-muted-foreground truncate text-lg">
              {shop.address}
            </span>
            <OpenBadge
              openHours={shop.openHours}
              className="ml-4 flex-shrink-0 text-base"
            />
          </Bullet>
        </div>
      </Base>
    </Link>
  );
};
