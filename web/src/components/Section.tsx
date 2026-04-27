import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@utils/common';

const sectionStyles = cva(
  'flex flex-col gap-16 py-16 pt-40 md:gap-32' + ' md:py-32' + ' md:pt-52',
  {
    variants: {
      variant: {
        default: 'bg-background',
        muted: 'bg-muted',
        lightPink: 'backDrop-blur-xl bg-lightPink bg-cover',
        pink: 'bg-pink bg-cover bg-center bg-no-repeat',
        blue: 'bg-blue',
        peach: 'bg-peach',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

type SectionProps = VariantProps<typeof sectionStyles> & {
  children: React.ReactNode;
  className?: string;
};

export const Section = ({ variant, children, className }: SectionProps) => (
  <section
    className={cn(
      sectionStyles({ variant }),
      'relative overflow-hidden',
      className,
    )}
  >
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.75]"
      style={{
        backgroundImage: "url('/grain.png')",
        backgroundRepeat: 'repeat',
        zIndex: 0,
      }}
    />
    {children}
  </section>
);
