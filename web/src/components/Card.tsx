import { HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@utils';
import { LucideIcon } from 'lucide-react';

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

interface CardIconProps extends VariantProps<typeof cardIconVariants> {
  icon: LucideIcon;
  className?: string;
}

export const Icon: React.FC<CardIconProps> = ({
  icon: IconComponent,
  className,
  variant,
}) => {
  return (
    <div className={cn(cardIconVariants({ variant }), className)}>
      <IconComponent size={48} strokeWidth={1.7} aria-hidden="true" />
    </div>
  );
};
Icon.displayName = 'Icon';

const cardTitleVariants = cva('font-inter z-10 font-semibold leading-tight', {
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

interface CardTitleProps
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
Title.displayName = 'Title';

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Body: React.FC<CardBodyProps> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={cn('font-inter z-10 text-lg leading-relaxed', className)}
    {...props}
  >
    {children}
  </div>
);
Body.displayName = 'Body';

interface CardRowProps extends HTMLAttributes<HTMLDivElement> {
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
Row.displayName = 'Row';

const cardImageVariants = cva('object-cover', {
  variants: {
    variant: {
      background: 'absolute inset-0 z-0 h-full w-full',
      inline: 'relative h-[300px] w-full self-stretch rounded-lg',
    },
  },
  defaultVariants: {
    variant: 'background',
  },
});

interface CardImageProps
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
}) => {
  return (
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
};
Image.displayName = 'Image';

const cardBaseVariants = cva('flex overflow-hidden rounded-lg', {
  variants: {
    variant: {
      default: 'bg-background flex h-auto flex-col p-8',
      imageBackground: [
        `text-background relative h-auto flex-1 flex-col justify-end gap-4
        bg-cover bg-center p-8 md:min-h-[384px]`,
      ],
      compact: 'bg-background h-auto w-full flex-1 flex-col p-6 text-sm',
      imageAbove: [
        `bg-background w-full flex-col rounded-lg sm:w-[calc(50%-2rem)]
        md:min-w-[300px] md:flex-1`,
      ],
      baseGray: 'bg-card-gray h-auto flex-col p-8',
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
}) => {
  return (
    <div className={cn(cardBaseVariants({ variant, className }))} {...props}>
      {' '}
      {children}
    </div>
  );
};
Base.displayName = 'Base';
