import * as React from 'react';
import { DialogProps } from '@radix-ui/react-dialog';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { Command as CommandPrimitive } from 'cmdk';

import { cn } from '@utils';
import {
  Dialog as DialogPrimitive,
  DialogContent,
} from '@components/shadcn/Dialog';

export const Root = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      `bg-popover text-popover-foreground flex h-full w-full flex-col
      overflow-hidden rounded-md`,
      className,
    )}
    {...props}
  />
));

Root.displayName = CommandPrimitive.displayName;

//

interface CommandDialogProps extends DialogProps {}

export const Dialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <DialogPrimitive {...props}>
      <DialogContent className="overflow-hidden p-0">
        <Root
          className="[&_[cmdk-group-heading]]:text-muted-foreground
            [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium
            [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0
            [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5
            [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12
            [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5
            [&_[cmdk-item]_svg]:w-5"
        >
          {children}
        </Root>
      </DialogContent>
    </DialogPrimitive>
  );
};

Dialog.displayName = 'CommandDialog';

//

export const Input = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <MagnifyingGlassIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        `placeholder:text-muted-foreground flex h-10 w-full rounded-md
        bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed
        disabled:opacity-50`,
        className,
      )}
      {...props}
    />
  </div>
));

Input.displayName = CommandPrimitive.Input.displayName;

//

export const List = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn('max-h-[300px] overflow-y-auto overflow-x-hidden', className)}
    {...props}
  />
));

List.displayName = CommandPrimitive.List.displayName;

//

export const Empty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
));

Empty.displayName = CommandPrimitive.Empty.displayName;

//

export const Group = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      `text-foreground [&_[cmdk-group-heading]]:text-muted-foreground
      overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2
      [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs
      [&_[cmdk-group-heading]]:font-medium`,
      className,
    )}
    {...props}
  />
));

Group.displayName = CommandPrimitive.Group.displayName;

//

export const Separator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('bg-border -mx-1 h-px', className)}
    {...props}
  />
));

Separator.displayName = CommandPrimitive.Separator.displayName;

//

export const Item = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      `aria-selected:bg-accent aria-selected:text-accent-foreground relative
      flex cursor-default select-none items-center rounded-sm px-2 py-1.5
      text-sm outline-none data-[disabled]:pointer-events-none
      data-[disabled]:opacity-50`,
      className,
    )}
    {...props}
  />
));

Item.displayName = CommandPrimitive.Item.displayName;

//

export const Shortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'text-muted-foreground ml-auto text-xs tracking-widest',
        className,
      )}
      {...props}
    />
  );
};

Shortcut.displayName = 'CommandShortcut';
