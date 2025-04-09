import type { LucideIcon } from 'lucide-react';
import type React from 'react';
import { cn } from '@utils';

interface BulletProps {
  icon: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export const Bullet: React.FC<BulletProps> = ({
  icon: Icon,
  children,
  className,
}) => {
  return (
    <div className={cn('flex w-full items-center text-sm', className)}>
      <div className="flex min-w-0 flex-grow items-center gap-1">
        <Icon
          size={16}
          className="text-muted-foreground flex-shrink-0"
          aria-hidden="true"
        />
        {children}
      </div>
    </div>
  );
};
