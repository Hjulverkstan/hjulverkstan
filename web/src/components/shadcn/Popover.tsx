import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';

import { cn } from '@utils/common';

export { Root, Trigger, Anchor } from '@radix-ui/react-popover';

export const Content = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    persistMount?: boolean;
    isOpen?: boolean;
  }
>(
  (
    {
      className,
      isOpen,
      persistMount = false,
      align = 'center',
      sideOffset = 4,
      ...props
    },
    ref,
  ) => (
    <PopoverPrimitive.Portal {...(persistMount ? { forceMount: true } : {})}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          `bg-popover text-popover-foreground data-[state=open]:animate-in
data-[state=closed]:animate-out data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95
data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2
data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2
data-[side=top]:slide-in-from-bottom-2 z-50 w-72 rounded-md border p-4 shadow-md
outline-none`,
          persistMount && isOpen !== undefined && !isOpen && 'hidden',
          className,
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  ),
);

Content.displayName = PopoverPrimitive.Content.displayName;
