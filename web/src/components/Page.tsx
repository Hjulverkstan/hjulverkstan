import { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import PageNavbar from '@components/PageNavbar';
import PageFooter from '@components/PageFooter';
import { cn } from '@utils/common';

const headingStyles = cva('', {
  variants: {
    headingWidth: {
      fullWidth: 'max-w-none',
      small: 'max-w-[1280px]',
      medium: 'max-w-[1360px]',
      large: 'max-w-[1852px]',
    },
  },
  defaultVariants: {
    headingWidth: 'large',
  },
});

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

type HeadingVariants = VariantProps<typeof headingStyles>;

export interface PageProps extends VariantProps<typeof pageStyles> {
  children: ReactNode;
  hasHeroSection?: boolean;
  heading?: ReactNode;
  headingWidth?: HeadingVariants['headingWidth'];
}

export const Page = ({
  children,
  hasHeroSection,
  heading,
  variant,
  headingWidth,
}: PageProps) => (
  <>
    <PageNavbar hasHeroSection={hasHeroSection} />
    <div className={cn(pageStyles({ variant }))}>
      {heading && (
        <div
          className={cn(
            'mx-auto -mb-8 w-[88vw] pt-28 md:-mb-16 md:pt-16',
            headingStyles({ headingWidth }),
          )}
        >
          <h1>{heading}</h1>
        </div>
      )}
      {children}
    </div>
    <PageFooter />
  </>
);
