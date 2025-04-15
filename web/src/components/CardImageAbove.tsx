import { MapPin } from 'lucide-react';
import { OpenBadge } from '@components/OpenBadge';
import { Bullet } from '@components/Bullet';
import { OpenHours } from '@data/webedit/shop/types';
import { Base, Image, Title } from '@components/Card';
import { Link, LinkProps as ButtonLinkProps } from '@components/shadcn/Button';

interface CardImageAboveProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subHeading?: string;
  address: string;
  openHours?: OpenHours | undefined | null;
  className?: string;
  useStrongSubHeading?: boolean;
  linkTo?: ButtonLinkProps['to'];
}

export const CardImageAbove: React.FC<CardImageAboveProps> = ({
  imageSrc,
  imageAlt,
  title,
  subHeading,
  address,
  openHours,
  className,
  useStrongSubHeading = false,
  linkTo,
}) => {
  const cardContent = (
    <Base variant="imageAbove" className={className}>
      <Image variant="inline" src={imageSrc} alt={imageAlt} />
      <div className="flex flex-col gap-2">
        <Title>{title}</Title>
        {subHeading && (
          <p
            className={`line-clamp-1 text-sm ${
              useStrongSubHeading ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            {subHeading}
          </p>
        )}
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

  if (linkTo) {
    return (
      <Link
        to={linkTo}
        variant="link"
        className="block h-full w-full text-current no-underline
          hover:no-underline focus:outline-none"
      >
        {cardContent}
      </Link>
    );
  }
  return cardContent;
};
