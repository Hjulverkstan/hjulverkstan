import * as React from 'react';

import { cn } from '@utils';

export const Root = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement> & { divClassName?: string }
>(({ className, divClassName, ...props }, ref) => (
  <div className={cn('relative w-full overflow-x-auto', divClassName)}>
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-sm', className)}
      {...props}
    />
  </div>
));

Root.displayName = 'TableRoot';

//

export const Header = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'bg-background [&_th]:bg-background [&:tr]:border-b',
      className,
    )}
    {...props}
  />
));

Header.displayName = 'TableHeader';

//

export const Body = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));

Body.displayName = 'TableBody';

//

export const Footer = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'bg-muted/50 border-t font-medium [&>tr]:last:border-b-0',
      className,
    )}
    {...props}
  />
));

Footer.displayName = 'TableFooter';

//

export type RowProps = React.HTMLAttributes<HTMLTableRowElement> & {
  isSelected?: boolean;
  disabled?: boolean;
};

export const Row = React.forwardRef<HTMLTableRowElement, RowProps>(
  ({ className, isSelected = false, disabled = false, ...props }, ref) => (
    <tr
      ref={ref}
      data-state={isSelected ? 'selected' : 'default'}
      className={cn(
        'border-b transition-colors',
        isSelected
          ? 'bg-muted [&>td]:bg-muted'
          : 'bg-background [&>td]:bg-background',
        disabled ? '' : '[&>td]:hover:bg-muted',
        className,
      )}
      {...props}
    />
  ),
);

Row.displayName = 'TableRow';

//

export const Head = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      `bg-background text-muted-foreground h-10 text-nowrap text-left
      align-middle font-medium [&:has([role=checkbox])]:pr-0
      [&>[role=checkbox]]:translate-y-[2px]`,
      className,
    )}
    {...props}
  />
));

Head.displayName = 'TableHead';

//

export const Cell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      `text-nowrap p-2 px-3 align-middle [&:has([role=checkbox])]:pr-0
      [&>[role=checkbox]]:translate-y-[2px]`,
      className,
    )}
    {...props}
  />
));

Cell.displayName = 'TableCell';

//

export const Caption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('text-muted-foreground mt-4 text-sm', className)}
    {...props}
  />
));

Caption.displayName = 'TableCaption';

//
