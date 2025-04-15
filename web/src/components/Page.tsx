import { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import PageNavbar from '@components/PageNavbar';
import PageFooter from '@components/PageFooter';
import { Breadcrumbs } from '@components/BreadCrumbs';
import { cn } from '@utils';
import { SectionContent } from '@components/SectionContent';

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
  showBreadcrumbs?: boolean;
  headingSuffix?: ReactNode;
}

export const Page = ({
  children,
  heading,
  variant,
  showBreadcrumbs = false,
  headingSuffix,
}: PageProps) => (
  <>
    <PageNavbar />
    <div className={cn(pageStyles({ variant }))}>
      {(heading || showBreadcrumbs) && (
        <SectionContent className="pt-16">
          {showBreadcrumbs && <Breadcrumbs />}
          {heading && (
            <div
              className={cn(
                `flex flex-col items-start gap-x-4 gap-y-2 md:flex-row
                md:items-center`,
                showBreadcrumbs ? 'mt-7' : '',
              )}
            >
              <h1 className="text-h1 text-foreground m-0 font-bold">
                {heading}
              </h1>
              {headingSuffix && <div className="md:ml-0">{headingSuffix}</div>}
            </div>
          )}
        </SectionContent>
      )}
      {children}
    </div>
    <PageFooter />
  </>
);
