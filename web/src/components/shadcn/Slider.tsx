import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@utils';

export type SliderProps = Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'min' | 'max'
> & {
  thumbs: 1 | 2;
  isActive?: boolean;
  steps: number[];
};

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, thumbs, steps, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
    min={0}
    max={steps.length - 1}
  >
    <SliderPrimitive.Track
      className="bg-secondary relative h-2 w-full grow overflow-hidden
        rounded-full"
    >
      <SliderPrimitive.Range
        className={cn(
          'absolute h-full',
          props.isActive ? 'bg-primary' : 'bg-secondary',
        )}
      />
    </SliderPrimitive.Track>
    <>
      {[...Array(thumbs)].map((_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          className={cn(
            `bg-background ring-offset-background focus-visible:ring-ring block
            h-5 w-5 rounded-full border-2 transition-colors
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-offset-2 disabled:pointer-events-none
            disabled:opacity-50`,
            props.isActive ? 'border-primary' : 'border-secondary',
          )}
        >
          <div
            className={cn(
              'absolute -top-6 rounded px-1 py-0.5 text-xs',
              props.isActive
                ? 'bg-gray-700 text-white'
                : 'bg-secondary text-secondary-foreground',
            )}
          >
            {props.value ? steps[props.value[i]] : ' '}
          </div>
        </SliderPrimitive.Thumb>
      ))}
    </>
  </SliderPrimitive.Root>
));

Slider.displayName = SliderPrimitive.Root.displayName;
