import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@utils/common';

const sectionStyles = cva('flex flex-col gap-16 py-16 md:gap-32 md:py-32', {
  variants: {
    variant: {
      default: 'bg-background',
      muted: 'bg-muted',
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
