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
        'flex w-full flex-col items-center justify-center bg-muted px-10 py-14',
        className,
      )}
    >
      {Icon && <Icon className="mb-2 h-5 w-5 text-muted-foreground" />}
      <p className="mx-auto text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
