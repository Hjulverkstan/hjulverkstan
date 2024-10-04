import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import * as U from '@utils';

export type SliderProps = Omit<
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
  'min' | 'max'
> & {
  /* Select a range or one value */
  thumbs: 1 | 2;
  /* Optionally set the minimum value of the left thumb */
  minThumbValue?: number;
  /* Optionally set the minimum value of the right thumb */
  maxThumbValue?: number;
  /* When active displays primary colors otherwise muted colors */
  isActive?: boolean;
  /* These are the possible numbers to chose on the slide */
  steps: number[];
};

export type SliderValue = [] | [number] | [number, number];

/**
 * This Slider is a remake of the shad-cn slider. While it stule uses the same
 * underlying radix slider component. It change how the data is driven and
 * controlled.
 *
 * The radix slider inly works with incremental index values from 0+ and is not
 * aware that our slider can have any values it wants. value and onValueChange
 * are abstracted upon to take and send the values defined by the step array
 * not the index values.
 *
 * It also limits how the thumb can be moved using minThumbValue and
 * maxThumbValue.
 */

export const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      thumbs,
      steps,
      isActive,
      value,
      onValueChange,
      minThumbValue,
      maxThumbValue,
      ...props
    },
    ref,
  ) => {
    const min = 0;
    const max = steps.length - 1;
    const minIndex = minThumbValue ? steps.indexOf(minThumbValue) : min;
    const maxIndex = maxThumbValue ? steps.indexOf(maxThumbValue) : max;

    const handleOnValueChange = (nextIndices: SliderValue) => {
      const nextValue = nextIndices.map((i) =>
        // Has new value
        steps[i] !== value?.[i]
          ? // Clamp to min max
            steps[U.clamp(minIndex, maxIndex, i)]
          : value[i],
      );

      if (!U.shallowEq(value, nextValue) && onValueChange) {
        onValueChange(nextValue);
      }
    };

    return (
      <div>
        <SliderPrimitive.Root
          ref={ref}
          className={U.cn(
            'relative flex w-full touch-none select-none items-center',
            className,
          )}
          value={value?.map((v) => steps.indexOf(v))}
          onValueChange={handleOnValueChange}
          min={min}
          max={max}
          {...props}
        >
          <SliderPrimitive.Track
            className="bg-secondary relative h-2 w-full grow overflow-hidden
              rounded-full"
          >
            <SliderPrimitive.Range
              className={U.cn(
                'absolute top-0 h-full',
                isActive ? 'bg-primary' : 'bg-secondary',
              )}
            />
          </SliderPrimitive.Track>
          <>
            <div
              className="absolute -top-7 flex h-4 w-full justify-between px-2
                py-1"
            >
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={U.cn(
                    'bg-secondary-foreground h-full w-[1px]',
                    index >= minIndex && index <= maxIndex
                      ? 'opacity-50'
                      : 'opacity-10',
                  )}
                  style={{
                    left: `${(index * 100) / (steps.length - 1)}%`,
                  }}
                />
              ))}
            </div>
            {[...Array(thumbs)].map((_, i) => (
              <SliderPrimitive.Thumb
                key={i}
                className={U.cn(
                  `bg-background ring-offset-background focus-visible:ring-ring
                  block h-5 w-5 rounded-full border-2 focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-offset-2
                  disabled:pointer-events-none disabled:opacity-50`,
                  isActive ? 'border-primary' : 'border-secondary',
                )}
              >
                <div
                  className={U.cn(
                    `absolute -top-6 left-1/2 -translate-x-1/2 transform rounded
                    px-1 py-0.5 text-xs`,
                    isActive
                      ? 'bg-gray-700 text-white'
                      : value && value[0] === value[1]
                        ? 'bg-secondary text-secondary-foreground/50'
                        : 'bg-secondary text-secondary-foreground',
                  )}
                >
                  {value?.[i] ?? ' '}
                </div>
              </SliderPrimitive.Thumb>
            ))}
          </>
        </SliderPrimitive.Root>
      </div>
    );
  },
);

Slider.displayName = SliderPrimitive.Root.displayName;
