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
  to?: string;
  linkLabel?: string;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  title,
  body,
  onClick,
  linkLabel,
  variant = 'default',
  to = '/',
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
    <div className="contents cursor-pointer">
      <Base
        variant={baseVariant}
        className={cn(
          'h-[540px] max-w-[390px] shadow-card-glow transition-shadow' +
            ' duration-300 ease-out' +
            ' hover:-translate-y-0.5 hover:shadow-card-glow-hover',
        )}
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
      >
        <Image src={image} variant={imageVariant} alt="" />
        <div className="relative z-10 flex h-full flex-col">
          <Title className="pb-4">{title}</Title>
          <Body className={cn(className, 'font-medium')}>{body}</Body>

          {(variant === 'multiple' || variant === 'pink') && (
            <Image variant={secondImageVariant} src={secondaryImage} alt="" />
          )}

          <div className={cn('mt-auto flex justify-end')}>
            <IconLink
              to={to}
              text={linkLabel}
              variant={buttonVariant}
              subVariant="rounded"
              className={cn(variant !== 'brown' && 'bg-background-footer',
                'text-[18px] font-[500]',
                )}
              size="large"
              icon={ArrowRight}
              aria-label={ariaLabel}
              iconRight
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
              }}
            />
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 z-30 rounded-[32px]
            ring-1 ring-inset ring-[#FDFDFD]/35"
          aria-hidden="true"
        />
      </Base>
    </div>
  );
};
