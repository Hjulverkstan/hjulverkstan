import { Card } from '@components/Card';
import { ShopAddress } from '@components/ShopAddress';

interface CardImageAboveProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  address: string;
  isOpen?: boolean;
  className?: string;
}

export const CardImageAbove: React.FC<CardImageAboveProps> = ({
  imageSrc,
  imageAlt,
  title,
  address,
  isOpen,
  className,
}) => {
  return (
    <Card.Base variant="imageAbove" className={className}>
      <Card.Image src={imageSrc} alt={imageAlt} />
      <Card.Title>{title}</Card.Title>
      <ShopAddress address={address} isOpen={isOpen} />
    </Card.Base>
  );
};
