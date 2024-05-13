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
        destructive: [
          `border-box border-destructive-border bg-destructive-fill
          text-destructive-foreground hover:bg-destructive-fill/80`,
        ],
        destructiveOutline: [
          'border-box border-destructive-border text-destructive-foreground',
        ],
        warn: [
          `border-box border-warn-border bg-warn-fill text-warn-foreground
          hover:bg-warn-fill/80`,
        ],
        warnOutline: ['border-box border-warn-border text-warn-foreground'],
        success: [
          `border-box border-success-border bg-success-fill
          text-success-foreground hover:bg-success-fill/80`,
        ],
        successOutline: [
          'border-box border-success-border text-success-foreground',
        ],
        contrast: 'bg-contrast text-contrast-foreground border-contrast',
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
