import React from 'react';
import { MapPin } from 'lucide-react';

import { OpenBadge } from '@components/OpenBadge';
import { Bullet } from '@components/Bullet';
import { Shop } from '@data/webedit/shop/types';
import { Base, Image, Title } from '@components/Card';

interface CardShopProps {
  shop: Shop;
  className?: string;
}

export const CardShop: React.FC<CardShopProps> = ({ shop, className }) => (
  <Base variant="imageAbove" className={className}>
    <Image
      variant="inline"
      src={shop.imageURL}
      alt={shop.name}
      className="h-64"
    />
    <Title>{shop.name}</Title>
    <Bullet icon={MapPin}>
      <p className="mr-2 truncate">{shop.address}</p>
      <OpenBadge openHours={shop.openHours} variant="large" />
    </Bullet>
  </Base>
);
