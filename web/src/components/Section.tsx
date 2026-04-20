import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@utils/common';

const sectionStyles = cva('flex flex-col gap-16 py-16 md:gap-32 md:py-32', {
  variants: {
    variant: {
      default: 'bg-background',
      muted: 'bg-muted',
      blue: 'bg-blue',
      peach: 'bg-peach',
      lightPink: 'bg-lightPink backDrop-blur-xl',
      pink: 'bg-pink bg-cover bg-center bg-no-repeat',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type SectionProps = VariantProps<typeof sectionStyles> & {
  children: React.ReactNode;
  className?: string;
};

export const Section = ({ variant, children, className }: SectionProps) => (
  <section className={cn(sectionStyles({ variant }), className)}>
    {children}
  </section>
);
