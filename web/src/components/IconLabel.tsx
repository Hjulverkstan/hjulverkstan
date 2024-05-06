import { ComponentType, ReactNode } from 'react';

export interface IconLabelProps {
  label: string;
  icon?: ComponentType<{ className?: string }>;
  children?: ReactNode;
}

export default function IconLabel({
  label,
  icon: Icon,
  children,
}: IconLabelProps) {
  return (
    <div className="flex items-center">
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      <span>{label}</span>
      {children}
    </div>
  );
}
