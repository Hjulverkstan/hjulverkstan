import { cn } from '@utils';
import { Link } from '@components/shadcn/Button';
import { ArrowRight } from 'lucide-react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@components/shadcn/Button';

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
  linkVariant = 'roundedContrastText',
}) => (
  <div
    className={cn(
      'font-inter mx-auto w-full max-w-[1920px] px-4 md:px-[140px]',
      className,
    )}
  >
    {(heading || (linkTo && linkLabel)) && (
      <div
        className="mb-[70px] flex flex-col items-start gap-4 sm:flex-row
          sm:items-center sm:justify-between"
      >
        {heading && (
          <h2 className="text-h2 text-foreground font-semibold">{heading}</h2>
        )}
        {linkTo && linkLabel && (
          <Link
            to={linkTo}
            variant={linkVariant}
            className="hidden h-10 items-center gap-1 text-[18px] font-semibold
              md:inline-flex"
            aria-label={linkLabel}
          >
            {linkLabel}
            <ArrowRight className="h-6 w-6" />
          </Link>
        )}
      </div>
    )}
    {children}
  </div>
);
