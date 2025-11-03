import { ComponentType, ReactNode } from 'react';
import { cn } from '@utils/common';

export interface IconLabelProps {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  children?: ReactNode;
  className?: string;
}

export default function IconLabel({
  label,
  icon: Icon,
  children,
  className,
}: IconLabelProps) {
  return (
    <div className={cn('flex items-center', className)}>
      {Icon && <Icon className="mr-1.5 h-4 w-4" />}
      <span>{label}</span>
      {children}
    </div>
  );
}
