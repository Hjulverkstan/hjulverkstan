import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@utils';

const badgeVariants = cva(
  `inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs
  font-semibold transition-colors focus:outline-none focus:ring-2
  focus:ring-ring focus:ring-offset-2`,
  {
    variants: {
      variant: {
        default: [
          `hover:bg-primary/80 border-transparent bg-primary
          text-primary-foreground shadow`,
        ],
        secondary: [
          `hover:bg-secondary/80 border-transparent bg-secondary
          text-secondary-foreground`,
        ],
        destructive: [
          [
            `hover:bg-destructive-fill/80 border-transparent bg-destructive-fill
            text-destructive-foreground`,
          ],
        ],
        warn: [
          [
            `hover:bg-warn-fill/80 border-transparent bg-warn-fill
            text-warn-foreground`,
          ],
        ],
        success: [
          [
            `hover:bg-success-fill/80 border-transparent bg-success-fill
            text-success-foreground`,
          ],
        ],
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
