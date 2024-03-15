import { cn } from '@utils';
import { AlertTriangle } from 'lucide-react';

export interface ErrorProps {
  msg: string;
  className?: string;
}

export default function Error({ msg, className }: ErrorProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center bg-muted px-10 py-14',
        className,
      )}
    >
      <AlertTriangle className="mb-2 h-5 w-5 text-muted-foreground" />
      <p className="mx-auto text-xs text-muted-foreground">{msg}</p>
    </div>
  );
}
