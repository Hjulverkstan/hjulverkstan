import * as U from '@utils';
import { LucideIcon } from 'lucide-react';

export interface MessageProps {
  icon?: LucideIcon;
  message: string;
  className?: string;
}

export default function Message({
  icon: Icon,
  message,
  className,
}: MessageProps) {
  return (
    <div
      className={U.cn(
        'bg-muted flex w-full flex-col items-center justify-center px-10 py-14',
        className,
      )}
    >
      {Icon && <Icon className="text-muted-foreground mb-2 h-5 w-5" />}
      <p className="text-muted-foreground mx-auto text-sm">{message}</p>
    </div>
  );
}
