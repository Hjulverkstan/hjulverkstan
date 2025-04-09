import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@utils';

const sectionStyles = cva('py-32 flex flex-col gap-32', {
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
