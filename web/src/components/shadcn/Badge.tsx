import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@utils';

export const badgeVariants = cva(
  `focus:ring-ring inline-flex items-center rounded-md border px-2.5 py-0.5
  text-xs font-semibold transition-colors focus:outline-none focus:ring-2
  focus:ring-offset-2`,
  {
    variants: {
      variant: {
        secondary: [
          `border-secondary-border bg-secondary text-secondary-foreground
          hover:bg-secondary/80`,
        ],
        red: [
          `border-red-border bg-red-fill text-red-foreground
          hover:bg-red-fill/80`,
        ],
        redOutline: ['border-red-border text-red-foreground'],
        yellow: [
          `border-yellow-border bg-yellow-fill text-yellow-foreground
          hover:bg-yellow-fill/80`,
        ],
        yellowOutline: ['border-yellow-border text-yellow-foreground'],
        green: [
          `border-green-border bg-green-fill text-green-foreground
          hover:bg-green-fill/80`,
        ],
        greenOutline: ['border-green-border text-green-foreground'],
        blue: [
          `border-blue-border bg-blue-fill text-blue-foreground
          hover:bg-blue-fill/80`,
        ],
        blueOutline: ['border-blue-border text-blue-foreground'],
        purple: [
          `border-purple-border bg-purple-fill text-purple-foreground
          hover:bg-purple-fill/80`,
        ],
        purpleOutline: ['border-purple-border text-purple-foreground'],
        outline: ['text-foreground/70 border-foreground/12'],
      },
      borderless: {
        yes: 'border-transparent',
        no: '',
      },
    },
    defaultVariants: {
      variant: 'secondary',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Omit<VariantProps<typeof badgeVariants>, 'borderless'> {
  borderless?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, borderless, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        badgeVariants({ variant, borderless: borderless ? 'yes' : 'no' }),
        className,
      )}
      {...props}
    />
  ),
);

Badge.displayName = 'Badge';
