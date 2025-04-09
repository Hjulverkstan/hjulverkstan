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
      <IconComponent size={48} aria-hidden="true" />
    </div>
  );
};
Icon.displayName = 'CardIcon';

//

const titleVariants = cva(
  'text-foreground font-inter font-semibold leading-tight',
  {
    variants: {
      variant: {
        base: 'text-2xl',
        imageOverlay: 'text-2xl text-white',
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

const bodyVariants = cva('text-foreground leading-relaxed', {
  variants: {
    variant: {
      base: 'text-base',
      imageOverlay: 'text-background line-clamp-2',
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
      className={cn('flex w-full flex-row items-center gap-3', className)}
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
}

const Image: React.FC<CardImageProps> = ({ src, alt, className, ...props }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'h-auto max-h-[300px] w-full self-stretch rounded-lg object-cover',
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
      base: 'flex-col gap-4 bg-white p-6',
      imageOverlay: 'relative justify-end bg-cover bg-center text-white',
      compact: 'h-auto w-full flex-1 flex-col gap-2 bg-white p-4 text-sm',
      imageAbove: 'flex-col bg-white',
      baseGray: 'flex-col gap-4 bg-gray-100 p-6',
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
  alt = '',
  minHeight,
  ...props
}) => {
  const variantStyles: CSSProperties = {};
  let role: string | undefined = undefined;
  let ariaLabel: string | undefined = undefined;
  let renderOverlayGradient = false;
  let wrapOverlayContent = false;

  if (variant === 'imageOverlay') {
    renderOverlayGradient = true;
    wrapOverlayContent = true;
    role = 'img';
    ariaLabel = alt;
    if (src) {
      variantStyles.backgroundImage = `url(${src})`;
      variantStyles.minHeight = minHeight || '450px';
    }
  }

  return (
    <div
      className={cn(cardBaseVariants({ variant }), className)}
      style={variantStyles}
      role={role}
      aria-label={ariaLabel}
      {...props}
    >
      {renderOverlayGradient && (
        <div
          className="absolute inset-0 -z-0 bg-gradient-to-t from-black/70
            via-black/20 to-transparent"
          aria-hidden="true"
        />
      )}
      {wrapOverlayContent ? (
        <div
          className="relative z-10 flex flex-grow flex-col justify-end gap-3 p-6"
        >
          {children}
        </div>
      ) : variant === 'imageAbove' ? (
        <div className="flex flex-col gap-3 ">{children}</div>
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
