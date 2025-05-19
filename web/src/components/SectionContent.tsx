import React from 'react';
import { ArrowRight } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';

import { cn } from '@utils';
import { buttonVariants, IconLink } from '@components/shadcn/Button';

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
  heading?: string;
  linkTo?: string;
  linkLabel?: string;
  linkVariant?: VariantProps<typeof buttonVariants>['variant'];
}

export const SectionContent: React.FC<SectionContentProps> = ({
  children,
  className,
  heading,
  linkTo,
  linkLabel,
  linkVariant = 'mutedSharp',
}) => (
  <div className={cn('mx-auto w-[88vw] max-w-[1852px]', className)}>
    {heading && (
      <div
        className="mb-8 flex flex-col items-start gap-4 sm:flex-row
          sm:items-center sm:justify-between md:mb-16"
      >
        <h2 className="text-h2 text-foreground font-semibold">{heading}</h2>
        {linkTo && linkLabel && (
          <IconLink
            to={linkTo}
            text={linkLabel}
            icon={ArrowRight}
            className="hidden md:inline-flex"
            variant={linkVariant}
            subVariant="rounded"
            size="large"
            iconRight
          />
        )}
      </div>
    )}
    {children}
    {linkTo && linkLabel && (
      <div className="mt-8 flex justify-end md:mt-16 md:hidden">
        <IconLink
          to={linkTo}
          text={linkLabel}
          icon={ArrowRight}
          variant={linkVariant}
          subVariant="rounded"
          size="large"
          iconRight
        />
      </div>
    )}
  </div>
);
