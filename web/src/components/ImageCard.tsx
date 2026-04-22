import { Base, Body, Image, Title } from '@components/Card';
import React from 'react';
import { IconLink } from '@components/shadcn/Button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@utils/common';

interface ImageCardProps {
  title: string;
  body: string;
  ariaLabel: string;
  variant?: 'default' | 'brown' | 'multiple' | 'noShadow' | 'pink';
  image?: string;
  secondaryImage?: string;
  secondImageVariant?: 'fullBleed' | 'fit';
  className?: string;
  onClick?: React.MouseEventHandler;
  link?: string;
  linkLabel?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  title,
  body,
  onClick,
  linkLabel,
  variant = 'default',
  link = '/',
  ariaLabel,
  image,
  secondaryImage,
  secondImageVariant,
  className,
}) => {
  const baseVariant =
    variant == 'brown'
      ? 'brown'
      : variant == 'pink'
        ? 'pink'
        : 'imageBackground';

  const imageVariant = ['brown', 'multiple', 'pink', 'noshadow'].includes(
    variant,
  )
    ? 'noShadow'
    : 'imageBackground';

  const buttonVariant = variant === 'brown' ? 'brownBackground' : 'brownText';

  return (
    <Base
      variant={baseVariant}
      className={cn('h-[540px] max-w-[390px] shadow-card-glow')}
    >
      <Image src={image} variant={imageVariant} alt="" />
      <div className="relative z-10 flex h-full flex-col">
        <Title className="pb-4">{title}</Title>
        <Body className={className}>{body}</Body>

        {(variant === 'multiple' || variant === 'pink') && (
          <Image variant={secondImageVariant} src={secondaryImage} alt="" />
        )}

        <div className={cn('mt-auto flex justify-end')}>
          <IconLink
            to={link}
            text={linkLabel}
            variant={buttonVariant}
            subVariant="rounded"
            size="large"
            icon={ArrowRight}
            aria-label={ariaLabel}
            iconRight
            onClick={onClick}
          />
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-30 rounded-[32px]
          ring-1 ring-inset ring-[#FDFDFD]/35"
        aria-hidden="true"
      />
    </Base>
  );
};
