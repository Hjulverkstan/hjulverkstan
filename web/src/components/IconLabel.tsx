import { ComponentType, ReactNode } from 'react';

export interface IconLabelProps {
  name: string;
  icon?: ComponentType<{ className?: string }>;
  children?: ReactNode;
}

export default function IconLabel({
  name,
  icon: Icon,
  children,
}: IconLabelProps) {
  return (
    <div className="flex items-center">
      {Icon && <Icon className="text-muted-foreground mr-2 h-4 w-4" />}
      <span>{name}</span>
      {children}
    </div>
  );
}
