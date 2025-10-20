import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@utils/common';

export { Provider, Root, Trigger } from '@radix-ui/react-tooltip';

export const Content = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      `text-thin bg-accent text-accent-foreground animate-in fade-in-0
zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0
data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2 z-50 m-1 overflow-hidden rounded-md
border px-2 py-1 text-xs shadow`,
      className,
    )}
    {...props}
  />
));

Content.displayName = TooltipPrimitive.Content.displayName;
