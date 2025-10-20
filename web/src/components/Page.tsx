import { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import PageNavbar from '@components/PageNavbar';
import PageFooter from '@components/PageFooter';
import { cn } from '@utils/common';

const pageStyles = cva('md:mt-16', {
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

export interface PageProps extends VariantProps<typeof pageStyles> {
  children: ReactNode;
  hasHeroSection?: boolean;
  heading?: ReactNode;
}

export const Page = ({
  children,
  hasHeroSection,
  heading,
  variant,
}: PageProps) => (
  <>
    <PageNavbar hasHeroSection={hasHeroSection} />
    <div className={cn(pageStyles({ variant }))}>
      {heading && (
        <div
          className="mx-auto -mb-8 w-[88vw] max-w-[1852px] pt-28 md:-mb-16
md:pt-16"
        >
          <h1>{heading}</h1>
        </div>
      )}
      {children}
    </div>
    <PageFooter />
  </>
);
