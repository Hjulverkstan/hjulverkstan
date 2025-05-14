import { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';

import { cn } from '@utils';

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
  <p className={cn('z-10', className)} {...props}>
    {children}
  </p>
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

const cardImageVariants = cva('object-cover', {
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
  src: string;
  alt: string;
  className?: string;
}

export const Image: React.FC<CardImageProps> = ({
  src,
  alt,
  variant = 'background',
  className,
  ...props
}) => (
  <>
    <img
      src={src}
      alt={alt}
      className={cn(cardImageVariants({ variant, className }))}
      loading="lazy"
      {...props}
    />
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
