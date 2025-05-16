import React, { ReactElement } from 'react';
import { cn } from '@utils';

export interface GridBetweenProps {
  rows: number;
  cols: number;
  children: ReactElement[];
  className?: string;
  rowClassName?: string;
}

/**
 * Creates a grid of said rows and columns where each rows uses space between.
 * This means, in comparison to a css grid where each shares the same width,
 * with this gris your first and last element starts at the left and right
 * edges of the grid.
 */

export const GridBetween = ({
  rows,
  cols,
  children,
  className,
  rowClassName,
}: GridBetweenProps) => (
  <div className={cn('flex flex-col gap-24', className)}>
    {[...Array(rows).keys()].map((row) => (
      <div
        key={row}
        className={cn('flex justify-between gap-24', rowClassName)}
      >
        {React.Children.toArray(children).slice(row * cols, (row + 1) * cols)}
      </div>
    ))}
  </div>
);
