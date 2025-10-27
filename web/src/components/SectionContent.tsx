import React from 'react';
import { ArrowRight } from 'lucide-react';
import { cva, VariantProps } from 'class-variance-authority';

import { cn } from '@utils/common';
import { buttonVariants, IconLink } from '@components/shadcn/Button';

const contentStyles = cva('', {
  variants: {
    contentWidth: {
      fullWidth: 'max-w-none',
      small: 'max-w-[1280px]',
      medium: 'max-w-[1360px]',
      large: 'max-w-[1852px]',
    },
  },
  defaultVariants: {
    contentWidth: 'large',
  },
});

interface SectionContentProps extends VariantProps<typeof contentStyles> {
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
  contentWidth,
}) => (
  <div
    className={cn(
      contentStyles({ contentWidth }),
      'mx-auto w-[88vw]',
      className,
    )}
  >
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
