import * as C from '@utils/common';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export interface MessageProps {
  icon?: LucideIcon;
  message: string;
  className?: string;
  children?: ReactNode;
}

export default function Message({
  icon: Icon,
  message,
  className,
  children,
}: MessageProps) {
  return (
    <div
      className={C.cn(
        'flex w-full flex-col items-center justify-center gap-2 px-10 py-14',
        className,
      )}
    >
      {Icon && <Icon className="text-muted-foreground h-5 w-5" />}
      <p className="text-muted-foreground mx-auto text-center text-sm">
        {message}
      </p>
      {children}
    </div>
  );
}
