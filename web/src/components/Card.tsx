import React, { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@utils';
import { LucideIcon } from 'lucide-react';

const iconVariants = cva('flex-shrink-0', {
  variants: {
    variant: {
      default: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface CardIconProps extends VariantProps<typeof iconVariants> {
  icon: LucideIcon;
  className?: string;
}

const Icon: React.FC<CardIconProps> = ({
  icon: IconComponent,
  className,
  variant,
}) => {
  return (
    <div className={cn(iconVariants({ variant }), className)}>
      <IconComponent size={48} strokeWidth={1.7} aria-hidden="true" />
    </div>
  );
};
Icon.displayName = 'CardIcon';

//

const titleVariants = cva(
  'text-foreground font-inter z-10 font-semibold leading-tight',
  {
    variants: {
      variant: {
        default: 'text-foreground',
        imageOverlay: 'text-background px-2 py-4 text-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

interface CardTitleProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  children: React.ReactNode;
  className?: string;
}

const Title: React.FC<CardTitleProps> = ({ children, className, ...props }) => {
  const baseTitleStyle =
    'font-inter z-10 font-semibold leading-tight text-2xl line-clamp-2';

  return (
    <div className={cn(baseTitleStyle, className)} {...props}>
      {children}
    </div>
  );
};
Title.displayName = 'CardTitle';

//

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Body: React.FC<CardBodyProps> = ({ children, className, ...props }) => {
  const baseBodyStyle = 'z-10 leading-relaxed text-base font-inter';

  return (
    <div className={cn(baseBodyStyle, className)} {...props}>
      {children}
    </div>
  );
};
Body.displayName = 'CardBody';

//

interface CardRowProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const Row: React.FC<CardRowProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn('z-5 flex w-full flex-row items-center gap-3', className)}
      {...props}
    >
      {children}
    </div>
  );
};
Row.displayName = 'CardRow';

//

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  variant?: 'background' | 'inline';
}

const Image: React.FC<CardImageProps> = ({
  src,
  alt,
  variant = 'background',
  className,
  ...props
}) => {
  return variant === 'background' ? (
    <div
      className={cn('absolute inset-0 z-0 bg-cover bg-center', className)}
      style={{ backgroundImage: `url(${src})` }}
      role="img"
      aria-label={alt}
      {...props}
    >
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20
          to-transparent"
        aria-hidden="true"
      />
    </div>
  ) : (
    <img
      src={src}
      alt={alt}
      className={cn(
        'h-[300px] w-full self-stretch rounded-lg object-cover',
        className,
      )}
      loading="lazy"
      {...props}
    />
  );
};
Image.displayName = 'CardImage';

//

const cardBaseVariants = cva('flex overflow-hidden rounded-lg', {
  variants: {
    variant: {
      default: 'bg-background h-auto flex-col gap-4 p-8',
      imageOverlay: [
        `text-background relative h-auto flex-1 flex-col justify-end gap-4
        bg-cover bg-center p-8 md:min-h-[413px]`,
      ],
      compact: 'h-auto w-full flex-1 flex-col gap-4 bg-white p-8 text-sm',
      imageAbove: [
        `bg-background w-full flex-col rounded-lg sm:w-[calc(50%-2rem)]
        md:min-w-[300px] md:flex-1`,
      ],
      baseGray: 'h-auto flex-col gap-4 bg-gray-100 p-6',
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

const CardBaseRoot: React.FC<CardBaseProps> = ({
  children,
  variant,
  className,
  ...props
}) => {
  return (
    <div className={cn(cardBaseVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
};
CardBaseRoot.displayName = 'CardBase';

export const Card = {
  Base: CardBaseRoot,
  Icon,
  Title,
  Body,
  Row,
  Image,
};
