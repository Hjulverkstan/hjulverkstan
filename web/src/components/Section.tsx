import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@utils/common';

const sectionStyles = cva(
  'flex flex-col gap-16 py-16 md:gap-32 md:pt-40' + ' md:py-32' + ' md:pt-44',
  {
    variants: {
      variant: {
        default: 'bg-background',
        muted: 'bg-muted',
        mutedFooter: 'bg-muted-footer',
        lightPink: 'backDrop-blur-xl bg-lightPink bg-cover shadow-inner-plum',
        pink: 'bg-pink bg-cover bg-center bg-no-repeat',
        blue: 'bg-blue shadow-inner-blue-top',
        peach: 'bg-peach shadow-inner-soft',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type SectionProps = VariantProps<typeof sectionStyles> & {
  children: React.ReactNode;
  grain?: boolean;
  className?: string;
};

export const Section = ({
  variant,
  children,
  className,
  grain = false,
}: SectionProps) => (
  <section
    className={cn(
      sectionStyles({ variant }),
      'relative overflow-hidden',
      className,
    )}
  >
    {grain && (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url('/grain.png')",
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
          zIndex: 0,
        }}
      />
    )}
    {children}
  </section>
);
