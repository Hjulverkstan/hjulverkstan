import { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import PageNavbar from '@components/PageNavbar';
import PageFooter from '@components/PageFooter';
import { cn } from '@utils';

const pageStyles = cva('mt-16', {
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
  heading?: ReactNode;
}

export const Page = ({ children, heading, variant }: PageProps) => (
  <>
    <PageNavbar />
    <div className={cn(pageStyles({ variant }))}>
      {heading && (
        <div className="mx-auto w-[88vw] max-w-[1852px] pt-16 -mb-16">
          {typeof heading === 'string' ? <h1>{heading}</h1> : heading}
        </div>
      )}
      {children}
    </div>
    <PageFooter />
  </>
);
