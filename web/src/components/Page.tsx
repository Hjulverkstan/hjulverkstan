import { ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

import PageNavbar from '@components/PageNavbar';
import PageFooter from '@components/PageFooter';
import { SectionContent } from '@components/SectionContent';
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
  headingSuffix?: ReactNode;
}

export const Page = ({
  children,
  heading,
  variant,
  headingSuffix,
}: PageProps) => (
  <>
    <PageNavbar />
    <div className={cn(pageStyles({ variant }))}>
      {(heading && (
        <SectionContent className="pt-16">
          {heading && (
            <div
              className={cn(
                `flex flex-col items-start gap-x-4 gap-y-2 md:flex-row
                md:items-center`,
              )}
            >
              <h1 className="text-h1 text-foreground m-0 font-bold">
                {heading}
              </h1>
              {headingSuffix && <div className="md:ml-0">{headingSuffix}</div>}
            </div>
          )}
        </SectionContent>
      ))}
      {children}
    </div>
    <PageFooter />
  </>
)