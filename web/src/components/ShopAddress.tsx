import { Pin } from 'lucide-react';
import React from 'react';
import { Bullet } from '@components/Bullet';
import { Badge } from '@components/shadcn/Badge';

interface ShopAddressProps {
  address: string;
  isOpen?: boolean;
  className?: string;
}

export const ShopAddress: React.FC<ShopAddressProps> = ({
  address,
  isOpen,
  className = 'pt-2',
}) => {
  const badgeToShow =
    isOpen === true ? (
      <Badge
        variant="successOutline"
        borderless={true}
        className="gap-1 bg-gray-100 text-green-500"
      >
        <span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-green-500"
          aria-hidden="true"
        ></span>
        <span>Open</span>
      </Badge>
    ) : isOpen === false ? (
      <Badge
        variant="destructiveOutline"
        borderless={true}
        className="gap-1 bg-gray-100 text-red-500"
      >
        <span
          className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-500"
          aria-hidden="true"
        ></span>
        <span>Closed</span>
      </Badge>
    ) : undefined;

  return (
    <Bullet icon={Pin} aside={badgeToShow} className={className}>
      {address}
    </Bullet>
  );
};
