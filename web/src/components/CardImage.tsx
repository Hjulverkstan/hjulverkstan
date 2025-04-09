import { IconLink, LinkProps } from '@components/shadcn/Button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@utils';
import { Base, Body, Image, Row, Title } from '@components/Card';

interface CardImageProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  body: string;
  link: LinkProps['to'];
  ariaLabel: string;
  className?: string;
}

export const CardImage: React.FC<CardImageProps> = ({
  imageSrc,
  imageAlt,
  title,
  body,
  link,
  ariaLabel,
  className,
}) => {
  return (
    <Base variant="imageBackground" className={className}>
      <Image variant="background" src={imageSrc} alt={imageAlt} />
      <Title variant="imageBackground">{title}</Title>
      <Row>
        <Body className="line-clamp-3">{body}</Body>
        <IconLink
          to={link}
          variant="roundedContrast"
          icon={ArrowRight}
          className={cn('ml-auto mt-auto h-10 w-10')}
          aria-label={ariaLabel}
        />
      </Row>
    </Base>
  );
};
