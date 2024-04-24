import * as React from 'react';
import { NavLinkProps, Link as RouterLink } from 'react-router-dom';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@utils';
import * as Tooltip from '@components/ui/Tooltip';

export const buttonVariants = cva(
  `focus-visible:ring-ring inline-flex items-center justify-center
  whitespace-nowrap rounded-md text-sm font-medium transition-colors
  focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none
  disabled:opacity-50`,
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground hover:bg-primary/80 shadow',
        destructive: [
          'bg-destructive text-background hover:bg-destructive/80 shadow-sm',
        ],
        outline: [
          `border-input bg-background hover:bg-accent
          hover:text-accent-foreground border shadow-sm`,
        ],
        secondary: [
          `bg-secondary text-secondary-foreground hover:bg-secondary/80
          shadow-sm`,
        ],
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-8 px-4 py-2',

        // Size is not used in this codebase yet, lets disable it for consistent
        // ui until the day we are brave enough for more variation

        /* sm: 'h-8 rounded-md px-3 text-xs',
         * lg: 'h-10 rounded-md px-8', */
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, /* size, */ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, /* size, */ className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';

//

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon?: any;
  text?: string;
  tooltip?: string;
}

export const IconButton = React.forwardRef<any, IconButtonProps>(
  ({ className, tooltip, text, icon: Icon, ...props }, ref) => {
    return (
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Button
            className={cn(
              'data-[state=open]:bg-muted flex h-8 p-0',
              text ? 'pl-3 pr-4' : 'w-8',
              className,
            )}
            ref={ref}
            {...props}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {text && <span className="pl-2">{text}</span>}
          </Button>
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

IconButton.displayName = 'IconButton';

//

export type LinkProps = NavLinkProps &
  ButtonProps &
  VariantProps<typeof buttonVariants>;

export const Link = ({
  className,
  variant,
  /* size, */ ...props
}: LinkProps) => (
  <RouterLink
    className={cn(buttonVariants({ variant, /* size, */ className }))}
    {...props}
  />
);

Link.displayName = RouterLink.displayName;
