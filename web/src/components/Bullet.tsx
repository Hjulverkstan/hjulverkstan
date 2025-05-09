import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import { cn } from '@utils';

interface BulletProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
  size?: number;
  iconClassName?: string;
}

export const Bullet: React.FC<BulletProps> = ({
  icon: Icon,
  children,
  className,
  size = 20,
  iconClassName = 'text-muted-foreground flex-shrink-0',
}) => (
  <div
    className={cn('text-muted-foreground flex w-full items-center', className)}
  >
    <div className="flex min-w-0 flex-grow items-center gap-2">
      <Icon size={size} className={iconClassName} aria-hidden="true" />
      {children}
    </div>
  </div>
);
