import type { LucideIcon } from 'lucide-react';
import type React from 'react';

interface BulletProps {
  icon: LucideIcon;
  children: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}

export const Bullet: React.FC<BulletProps> = ({
  icon: Icon,
  children,
  aside,
  className = '',
}) => {
  return (
    <div
      className={`flex w-full items-center justify-between text-sm ${className}`}
    >
      <div className="flex min-w-0 items-center gap-1">
        <Icon
          size={16}
          className="flex-shrink-0 text-gray-600"
          aria-hidden="true"
        />
        <div className="truncate">{children}</div>
      </div>

      {aside && <div className="ml-2 flex-shrink-0">{aside}</div>}
    </div>
  );
};
