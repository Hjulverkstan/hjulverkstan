import * as React from 'react';
import { NavLinkProps, Link as RouterLink } from 'react-router-dom';
import { Slot } from '@radix-ui/react-slot';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@utils';
import * as Tooltip from '@components/shadcn/Tooltip';

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
        destructive: ['bg-destructive text-background hover:bg-destructive/80'],
        outline: [
          `border-input bg-background hover:bg-accent
          hover:text-accent-foreground border`,
        ],
        secondary: [
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow',
        ],
        contrast: [
          'bg-contrast text-contrast-foreground hover:bg-contrast/80 ',
        ],
        accent: [
          [
            `data-[state=active]:text-accent-foreground
            data-[state=active]:border-secondary-border bg-accent
            hover:border-secondary-border text-muted-foreground
            hover:text-accent-foreground border`,
          ],
        ],
        ghost: 'hover:bg-accent hover:text-accent-foreground !shadow-none',
        link: 'text-primary underline-offset-4 !shadow-none hover:underline',
      },
      subVariant: {
        default: 'shadow-sm',
        flat: 'shadow-none',
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
      /* size, */ asChild = false,
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
              buttonVariants({ variant, subVariant, /* size, */ className }),
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

export interface IconButtonProps extends Omit<ButtonProps, 'children'> {
  icon?: any;
  text?: string;
}

export const IconButton = React.forwardRef<any, IconButtonProps>(
  ({ className, text, icon: Icon, ...props }, ref) => {
    return (
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
