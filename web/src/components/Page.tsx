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
  heading?: string;
}

export const Page = ({ children, heading, variant }: PageProps) => (
  <>
    <PageNavbar />
    <div className={cn(pageStyles({ variant }))}>
      {heading && (
        <div className="mx-auto w-[88vw] max-w-[1852px] pb-16 pt-16">
          <h1 className="text-h1 text-foreground m-0 font-bold">{heading}</h1>
        </div>
      )}
      {children}
    </div>
    <PageFooter />
  </>
);
