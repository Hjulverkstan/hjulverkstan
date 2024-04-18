import { ComponentType, ReactNode } from 'react';
import { cva, VariantProps } from 'class-variance-authority';

const iconLabelVariants = cva('flex items-center', {
  variants: {
    variant: {
      default: '',
      destructive: 'text-destructive-foreground',
      warn: 'text-warn-foreground',
      success: 'text-success-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export type IconLabelProps = VariantProps<typeof iconLabelVariants> & {
  name: string;
  icon?: ComponentType<{ className?: string }>;
  children?: ReactNode;
};

export default function IconLabel({
  name,
  variant,
  icon: Icon,
  children,
}: IconLabelProps) {
  return (
    <div className={iconLabelVariants({ variant })}>
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{name}</span>
      {children}
    </div>
  );
}
