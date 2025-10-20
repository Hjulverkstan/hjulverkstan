import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@utils/common';
import { ComponentType } from 'react';

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
          `border-box border-red-border bg-red-fill text-red-foreground
hover:bg-red-fill/80`,
        ],
        redOutline: 'border-box border-red-border text-red-foreground',
        yellow: [
          `border-box border-yellow-border bg-yellow-fill text-yellow-foreground
hover:bg-yellow-fill/80`,
        ],
        yellowMuted: 'border-box bg-muted !text-yellow-accent',
        yellowOutline: 'border-box border-yellow-border text-yellow-foreground',
        green: [
          `border-box border-green-border bg-green-fill text-green-foreground
hover:bg-green-fill/80`,
        ],
        greenMuted: 'border-box bg-muted !text-green-accent',
        greenOutline: 'border-box border-green-border text-green-foreground',
        blue: [
          `border-box border-blue-border bg-blue-fill text-blue-foreground
hover:bg-blue-fill/80`,
        ],
        blueOutline: 'border-box border-blue-border text-blue-foreground',
        purple: [
          `border-box border-purple-border bg-purple-fill text-purple-foreground
hover:bg-purple-fill/80`,
        ],
        purpleOutline: 'border-box border-purple-border text-purple-foreground',
        contrast: 'bg-contrast text-contrast-foreground border-contrast',
        outline: 'text-foreground/70 border-foreground/12',
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
  icon?: ComponentType<any>;
  borderless?: boolean;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, borderless, icon: Icon, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        badgeVariants({
          variant,
          borderless: borderless ? 'yes' : 'no',
        }),
        className,
      )}
      {...props}
    >
      {Icon && <Icon className="ml--1 h-3.5 w-3.5" />}
      {children}
    </div>
  ),
);

Badge.displayName = 'Badge';
