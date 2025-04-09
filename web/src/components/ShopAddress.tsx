import { LucideIcon } from 'lucide-react';
import React from 'react';

export const OpenBadge = () => (
  <span className="whitespace-nowrap font-semibold text-green-500">Open</span>
);

interface ShopAddressProps {
  icon: LucideIcon;
  address: string;
  isOpen?: boolean;
}

export const ShopAddress: React.FC<ShopAddressProps> = ({
  icon: Icon,
  address,
  isOpen,
}) => {
  return (
    <div className="flex w-full justify-between pt-2 text-sm">
      <div className="flex items-center gap-1">
        <Icon size={16} className="flex-shrink-0 text-gray-600" />
        <span>{address}</span>
      </div>
      {isOpen && <OpenBadge />}
    </div>
  );
};
