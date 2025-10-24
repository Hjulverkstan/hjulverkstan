import React, { HTMLAttributes } from 'react';

import { cva, VariantProps } from 'class-variance-authority';
import { ImageIcon, LucideIcon } from 'lucide-react';

import { cn } from '@utils/common';
import { ImageWithFallback } from '@components/ImageWithFallback';
import { endpoints } from '@data/api';
import Error from '@components/Error';

//

const cardIconVariants = cva('flex-shrink-0', {
  variants: {
    variant: {
      default: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardIconProps extends VariantProps<typeof cardIconVariants> {
  icon: LucideIcon;
  className?: string;
}

export const Icon: React.FC<CardIconProps> = ({
  icon: IconComponent,
  className,
  variant,
}) => (
  <div className={cn(cardIconVariants({ variant }), className)}>
    <IconComponent size={42} strokeWidth={1.7} aria-hidden="true" />
  </div>
);

Icon.displayName = 'CardIcon';

//

export const cardTitleVariants = cva('z-10', {
  variants: {
    variant: {
      default: 'text-foreground text-h3 line-clamp-2',
      imageBackground: 'text-background text-h3',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardTitleProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {
  children: React.ReactNode;
  className?: string;
}

export const Title: React.FC<CardTitleProps> = ({
  children,
  className,
  variant,
  ...props
}) => (
  <div className={cn(cardTitleVariants({ variant, className }))} {...props}>
    {children}
  </div>
);

Title.displayName = 'CardTitle';

//

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Body: React.FC<CardBodyProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={cn('z-10', className)} {...props}>
    {children}
  </div>
);

Body.displayName = 'CardBody';

//

export interface CardRowProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Row: React.FC<CardRowProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn('z-10 flex w-full flex-row items-start gap-4', className)}
    {...props}
  >
    {children}
  </div>
);

Row.displayName = 'CardRow';

//

const cardImageVariants = cva('bg-muted overflow-hidden', {
  variants: {
    variant: {
      background: 'absolute inset-0 z-0 h-full w-full',
      inline: 'relative mb-4 w-full self-stretch rounded-lg',
    },
  },
  defaultVariants: {
    variant: 'background',
  },
});

export interface CardImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement>,
    VariantProps<typeof cardImageVariants> {
  src?: string;
  alt: string;
  fallbackIcon?: LucideIcon;
  className?: string;
}

export const Image: React.FC<CardImageProps> = ({
  src,
  alt,
  variant = 'background',
  fallbackIcon: FallbackIcon = ImageIcon,
  className,
  ...props
}) => (
  <>
    <div className={cn(cardImageVariants({ variant }), className)}>
      {src ? (
        <ImageWithFallback
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          fallback={
            <Error
              className="h-full"
              error={{
                error: 'NOT_FOUND',
                endpoint: endpoints.image,
              }}
            />
          }
          loading="lazy"
          {...props}
        />
      ) : (
        <div
          className="text-muted-foreground/60 flex h-full items-center
            justify-center"
        >
          <FallbackIcon size={40} />
        </div>
      )}
    </div>
    {variant === 'background' && (
      <div
        className="absolute inset-0 z-10 bg-gradient-to-t from-black/70
          via-black/20 to-transparent"
        aria-hidden="true"
      />
    )}
  </>
);

Image.displayName = 'CardImage';

//

const cardBaseVariants = cva('flex flex-col overflow-hidden rounded-lg', {
  variants: {
    variant: {
      default: 'bg-background h-auto p-8',
      muted: 'bg-muted h-auto p-8',
      imageBackground: [
        `text-background light relative h-auto justify-end gap-4 bg-cover
        bg-center p-8`,
      ],
      compact: 'bg-background h-auto w-full flex-1 gap-4 p-8',
      imageAbove: 'bg-background w-full gap-2 rounded-lg md:flex-1',
      padded:
        'bg-muted md:bg-background h-auto w-full px-5 py-10 md:px-16 md:py-16',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardBaseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardBaseVariants> {
  children: React.ReactNode;
  className?: string;
}

export const Base: React.FC<CardBaseProps> = ({
  children,
  variant,
  className,
  ...props
}) => (
  <div className={cn(cardBaseVariants({ variant, className }))} {...props}>
    {' '}
    {children}
  </div>
);

Base.displayName = 'CardBase';
