import { MapPin } from 'lucide-react';
import { OpenBadge } from '@components/OpenBadge';
import { Bullet } from '@components/Bullet';
import { OpenHours } from '@data/webedit/shop/types';
import { Base, Image, Title } from '@components/Card';

interface CardImageAboveProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  address: string;
  openHours?: OpenHours | undefined | null;
  className?: string;
}

export const CardImageAbove: React.FC<CardImageAboveProps> = ({
  imageSrc,
  imageAlt,
  title,
  address,
  openHours,
  className,
}) => {
  return (
    <Base variant="imageAbove" className={className}>
      <Image variant="inline" src={imageSrc} alt={imageAlt} />
      <div className="flex flex-col gap-3 pt-6">
        <Title>{title}</Title>
        <Bullet icon={MapPin}>
          <span className="text-muted-foreground truncate text-lg">
            {address}
          </span>
          <OpenBadge
            openHours={openHours}
            className="ml-4 flex-shrink-0 text-base"
          />
        </Bullet>
      </div>
    </Base>
  );
};
