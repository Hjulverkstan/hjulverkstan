import { MapPin } from 'lucide-react';

import { OpenBadge } from '@components/OpenBadge';
import { Bullet } from '@components/Bullet';
import { Shop } from '@data/webedit/shop/types';
import { Base, Image, Title } from '@components/Card';
import { Link, LinkProps as ButtonLinkProps } from '@components/shadcn/Button';
import { usePreloadedDataLocalized } from '@hooks/usePreloadedData';

interface CardShopProps {
  shop: Shop;
  className?: string;
}

export const CardShop: React.FC<CardShopProps> = ({
  shop,
  className,
}) => {
  const { currLocale } = usePreloadedDataLocalized();

  return (
    <Link
      to={`/${currLocale}/shops/${shop.slug}`}
      variant="link"
      className="block h-full w-full p-0 no-underline hover:no-underline"
    >
      <Base variant="imageAbove" className={className}>
        <Image
          variant="inline"
          src={shop.imageURL}
          alt={shop.name}
          className="h-64 w-full object-cover"
        />
        <Title>{shop.name}</Title>
        <Bullet icon={MapPin}>
          <p className="mr-2 truncate text-body">{shop.address}</p>
          <OpenBadge openHours={shop.openHours} variant="large" />
        </Bullet>
      </Base>
    </Link>
  );
};
