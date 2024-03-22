import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@utils';

export { Provider, Root, Trigger } from '@radix-ui/react-tooltip';

export const Content = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      `text-thin z-50 m-1 overflow-hidden rounded-md border bg-accent px-2 py-1
      text-xs text-accent-foreground shadow animate-in fade-in-0 zoom-in-95
      data-[state=closed]:animate-out data-[state=closed]:fade-out-0
      data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2
      data-[side=left]:slide-in-from-right-2
      data-[side=right]:slide-in-from-left-2
      data-[side=top]:slide-in-from-bottom-2`,
      className,
    )}
    {...props}
  />
));

Content.displayName = TooltipPrimitive.Content.displayName;
