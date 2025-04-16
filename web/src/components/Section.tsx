import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '@utils';

const sectionStyles = cva('py-[140px]', {
  variants: {
    variant: {
      gray: 'bg-[#F7F7F7]',
      white: 'bg-white',
    },
  },
  defaultVariants: {
    variant: 'white',
  },
});

type SectionProps = VariantProps<typeof sectionStyles> & {
  children: React.ReactNode;
  className?: string;
};

export const Section = ({ variant, children, className }: SectionProps) => {
  return (
    <section className={cn(sectionStyles({ variant }), className)}>
      {children}
    </section>
  );
};
