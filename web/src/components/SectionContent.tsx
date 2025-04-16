import { cn } from '@utils';

interface SectionContentProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionContent: React.FC<SectionContentProps> = ({
  children,
  className,
}) => {
  const baseStyles = cn(
    'mx-auto',
    'w-full',
    'max-w-[1920px]',
    'px-4',
    'md:px-[140px]',
    'font-inter',
  );

  return <div className={cn(baseStyles, className)}>{children}</div>;
};
