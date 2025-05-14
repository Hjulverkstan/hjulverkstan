import { MapPin } from 'lucide-react';

import { OpenBadge } from '@components/OpenBadge';
import { Bullet } from '@components/Bullet';
import { Shop } from '@data/webedit/shop/types';
import { Base, Image, Title } from '@components/Card';
import { Link, LinkProps as ButtonLinkProps } from '@components/shadcn/Button';

interface CardShopProps {
  shop: Shop;
  className?: string;
  linkTo?: ButtonLinkProps['to'];
}

export const CardShop: React.FC<CardShopProps> = ({
  shop,
  className,
  linkTo,
}) => {
  const cardContent = (
    <Base variant="imageAbove" className={className}>
      <Image
        variant="inline"
        src={shop.imageURL}
        alt={shop.name}
        className="h-64 w-full object-cover"
      />
      <Title>{shop.name}</Title>
      <Bullet icon={MapPin}>
        <p className="mr-2 truncate">{shop.address}</p>
        <OpenBadge openHours={shop.openHours} variant="large" />
      </Bullet>
    </Base>
  );

  return linkTo ? (
    <Link
      to={linkTo}
      variant="link"
      className="block h-full w-full p-0 no-underline hover:no-underline"
    >
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};
