import * as React from 'react';
import {
  LinkProps as RouterLinkProps,
  Link as RouterLink,
} from 'react-router-dom';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@utils/common';
import * as Tooltip from '@components/shadcn/Tooltip';

//

export const buttonVariants = cva(
  `focus-visible:ring-ring inline-flex flex-shrink-0 items-center justify-center
whitespace-nowrap rounded-md text-sm font-medium transition-colors
focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none
disabled:opacity-50`,
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/80' +
          ' data-[state=open]:bg-muted shadow',
        red: ['bg-red text-background hover:bg-red/80'],
        outline: [
          `border-input bg-background hover:bg-accent
hover:text-accent-foreground border`,
        ],
        secondary: [
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow',
        ],
        secondarySharp: [
          'bg-secondary text-foreground shadow-none hover:opacity-80',
        ],
        contrast: ['bg-contrast text-contrast-foreground hover:bg-contrast/80'],
        mutedSharp: ['bg-muted text-foreground shadow-none hover:opacity-80'],
        background: ['bg-background text-foreground hover:opacity-80'],
        accent: [
          [
            `data-[state=active]:text-accent-foreground
data-[state=active]:border-secondary-border bg-accent
hover:border-secondary-border text-muted-foreground hover:text-accent-foreground
border`,
          ],
        ],
        ghost: 'hover:bg-accent hover:text-accent-foreground !shadow-none',
        link: 'text-foreground hover:text-foreground/55 !shadow-none',
      },
      subVariant: {
        default: 'shadow-sm',
        rounded: 'rounded-full shadow-none',
        flat: 'shadow-none',
      },
      size: {
        none: '',
        default: 'h-8 px-4 py-2',
        defaultIcon: 'h-8 w-8 p-0',
        defaultIconText: 'h-8 px-3',
        large: 'h-10 px-4 py-10',
        largeIcon: 'h-10 w-10 p-0',
        largeIconText: 'h-10 px-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      subVariant: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  tooltip?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      subVariant,
      size,
      asChild = false,
      tooltip,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Comp
            className={cn(
              buttonVariants({
                variant,
                subVariant,
                size,
              }),
              className,
            )}
            ref={ref}
            {...props}
          />
        </Tooltip.Trigger>
        {tooltip && (
          <Tooltip.Content>
            <p>{tooltip}</p>
          </Tooltip.Content>
        )}
      </Tooltip.Root>
    );
  },
);

Button.displayName = 'Button';

//

export interface IconButtonProps
  extends Omit<ButtonProps, 'children' | 'size'> {
  icon?: any;
  text?: string;
  iconRight?: true;
  size?: 'default' | 'large';
}

export const IconButton = React.forwardRef<any, IconButtonProps>(
  (
    {
      className,
      text,
      size = 'default',
      icon: Icon,
      iconRight = false,
      ...props
    },
    ref,
  ) => (
    <Button
      className={className}
      ref={ref}
      size={`${size}Icon${text ? 'Text' : ''}`}
      {...props}
    >
      {Icon && !iconRight && (
        <Icon className={size === 'default' ? 'h-4 w-4' : 'h-6 w-6'} />
      )}
      {text && (
        <span className={iconRight ? 'pl-1 pr-2' : 'pl-2 pr-1'}>{text}</span>
      )}
      {Icon && iconRight && (
        <Icon className={size === 'default' ? 'h-4 w-4' : 'h-6 w-6'} />
      )}
    </Button>
  ),
);

IconButton.displayName = 'IconButton';

//

export type LinkProps = RouterLinkProps & VariantProps<typeof buttonVariants>;

export const Link = ({
  className,
  variant,
  subVariant,
  size,
  ...props
}: LinkProps) => (
  <RouterLink
    className={cn(buttonVariants({ variant, size, subVariant }), className)}
    {...props}
  />
);

Link.displayName = RouterLink.displayName;

//

export interface IconLinkProps
  extends Omit<LinkProps, 'children' | 'ref' | 'size'> {
  icon: React.ElementType;
  iconRight?: true;
  size?: 'default' | 'large';
  text?: string;
}

export const IconLink: React.FC<IconLinkProps> = ({
  text,
  size = 'default',
  iconRight = false,
  icon: Icon,
  ...props
}) => (
  <Link size={`${size}Icon${text ? 'Text' : ''}`} {...props}>
    {Icon && !iconRight && (
      <Icon className={size === 'default' ? 'h-4 w-4' : 'h-6 w-6'} />
    )}
    {text && (
      <span className={iconRight ? 'pl-1 pr-2' : 'pl-2 pr-1'}>{text}</span>
    )}
    {Icon && iconRight && (
      <Icon className={size === 'default' ? 'h-4 w-4' : 'h-6 w-6'} />
    )}
  </Link>
);

IconLink.displayName = 'IconLink';
