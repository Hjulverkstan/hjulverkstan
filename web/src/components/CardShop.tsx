import { MapPin } from 'lucide-react';

import { OpenBadge } from '@components/OpenBadge';
import { Bullet } from '@components/Bullet';
import { Shop } from '@data/webedit/shop/types';
import { Base, Image, Title } from '@components/Card';
import { Link } from '@components/shadcn/Button';

interface CardShopProps {
  shop: Shop;
  className?: string;
}

export const CardShop: React.FC<CardShopProps> = ({ shop, className }) => (
  <Link
    to={`/shops/${shop.slug}`}
    variant="link"
    className="block h-full w-full p-0 no-underline hover:no-underline"
  >
    <Base variant="imageAbove" className={className}>
      <div
        className="mb-4 rounded-[32px] border border-black/10 shadow-pink-blur"
      >
        <Image
          variant="inline"
          src={shop.imageURL}
          alt={shop.name}
          className="!mb-0 !h-[300px] !rounded-[32px] !bg-transparent"
        />
      </div>
      <Title>{shop.name}</Title>
      <Bullet icon={MapPin}>
        <p className="text-body mr-2 truncate">{shop.address}</p>
        <OpenBadge openHours={shop.openHours} variant="large" />
      </Bullet>
    </Base>
  </Link>
);
