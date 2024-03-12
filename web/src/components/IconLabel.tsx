import { type ComponentType } from 'react';

export interface IconLabelProps {
  name: string;
  icon: ComponentType<{ className?: string }>;
}

export default function IconLabel({ name, icon: Icon }: IconLabelProps) {
  return (
    <div className="flex items-center">
      {Icon && <Icon className="mr-2 h-4 w-4 text-muted-foreground" />}
      <span>{name}</span>
    </div>
  );
}
