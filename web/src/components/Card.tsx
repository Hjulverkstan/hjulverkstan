import React, { CSSProperties, HTMLAttributes } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@utils';
import { LucideIcon } from 'lucide-react';

const iconVariants = cva('flex-shrink-0', {
  variants: {
    variant: {
      base: 'text-primary',
      imageOverlay: 'background',
    },
  },
  defaultVariants: {
    variant: 'base',
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
        base: 'text-h3',
        imageOverlay: 'px-2 py-4 text-2xl text-white',
      },
    },
    defaultVariants: {
      variant: 'base',
    },
  },
);

interface CardTitleProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof titleVariants> {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Title: React.FC<CardTitleProps> = ({
  variant,
  children,
  className,
  as: Component = 'h2',
  ...props
}) => {
  return (
    <Component className={cn(titleVariants({ variant }), className)} {...props}>
      {children}
    </Component>
  );
};
Title.displayName = 'CardTitle';

//

const bodyVariants = cva('text-foreground z-10 leading-relaxed', {
  variants: {
    variant: {
      base: 'text-lg',
      imageOverlay: 'text-background line-clamp-2 px-2',
      compact: 'line-clamp-2 text-sm',
    },
  },
  defaultVariants: {
    variant: 'base',
  },
});

interface CardBodyProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bodyVariants> {
  children: React.ReactNode;
  className?: string;
}

const Body: React.FC<CardBodyProps> = ({
  variant,
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn(bodyVariants({ variant }), className)} {...props}>
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
  if (variant === 'background') {
    return (
      <div
        className={cn('absolute inset-0 z-0 bg-cover bg-center', className)}
        style={{ backgroundImage: `url(${src})` }}
        role="img"
        aria-label={alt}
        {...props}
      >
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70
            via-black/20 to-transparent"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'h-64 max-h-[300px] w-full self-stretch rounded-lg object-cover',
        className,
      )}
      loading="lazy"
      {...props}
    />
  );
};
Image.displayName = 'CardImage';

//

const cardBaseVariants = cva('flex overflow-hidden rounded-lg shadow-sm', {
  variants: {
    variant: {
      base: 'h-auto flex-col gap-6 bg-white p-8',
      imageOverlay: [
        `relative h-auto flex-1 flex-col justify-end bg-cover bg-center
        text-white md:min-h-[413px]`,
      ],
      compact: 'h-auto w-full flex-1 flex-col gap-2 bg-white p-4 text-sm',
      imageAbove: [
        `w-full flex-col bg-white sm:w-[calc(50%-1rem)] md:min-w-[300px]
        lg:grow-0 lg:basis-[calc((100%-4rem)/3)]`,
      ],
      baseGray: 'h-auto flex-col gap-4 bg-gray-100 p-6',
    },
  },
  defaultVariants: {
    variant: 'base',
  },
});

export interface CardBaseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardBaseVariants> {
  children: React.ReactNode;
  className?: string;
  src?: string;
  alt?: string;
  minHeight?: string | number;
}

const CardBaseRoot: React.FC<CardBaseProps> = ({
  children,
  variant = 'base',
  className,
  src,
  minHeight,
  ...props
}) => {
  const variantStyles: CSSProperties = {};

  return (
    <div
      className={cn(cardBaseVariants({ variant }), className)}
      style={variantStyles}
      {...props}
    >
      {variant === 'imageAbove' ? (
        <div className="relative flex flex-col gap-3">{children}</div>
      ) : (
        children
      )}
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
