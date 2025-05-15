import { MapPin } from 'lucide-react';
import React from 'react';

import { OpenBadge } from '@components/OpenBadge';
import { Bullet } from '@components/Bullet';
import { Shop } from '@data/webedit/shop/types';
import { Base, Image, Title } from '@components/Card';
import { Link } from '@components/shadcn/Button';
import { Vehicle } from '@data/vehicle/types';

interface CardBikeProps {
  shop: Shop;
  vehicle: Vehicle;
}

export const CardBike: React.FC<CardBikeProps> = ({ shop, vehicle }) => (
  <Link
    to={`/bike/${vehicle.id}`}
    variant="link"
    className="block h-full w-full text-current no-underline hover:no-underline
      focus:outline-none"
  >
    <Base variant="imageAbove">
      <Image variant="inline" src={vehicle.imageURL} alt={vehicle.regTag} />
      <div className="flex flex-col gap-3 pt-6">
        <Title>{vehicle.regTag}</Title>
        <p className={'text-foreground line-clamp-1 text-sm'}>{shop.name}</p>
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
