import { AlertTriangle } from 'lucide-react';

import * as api from '@api';
import { cn } from '@utils';

export enum ErrorEndpoint {
  VEHICLE,
}

export interface ErrorProps {
  error: api.ErrorRes;
  className?: string;
}

const messages: Record<string, any> = {
  ECONNABORTED: {
    DEFAULT: 'Server is not responding.',
  },
  NOT_FOUND: {
    [api.endpoints.vehicle]: 'Vehicle not found.',
    DEFAULT: 'What you where looking for no longer exists.',
  },
  DEFAULT: 'There was an unknown error.',
};

const toMessage = ({ error, endpoint }: api.ErrorRes) =>
  messages[error]?.[endpoint] ?? messages[error]?.DEFAULT ?? messages.DEFAULT;

export default function Error({ error, className }: ErrorProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col items-center justify-center bg-muted px-10 py-14',
        className,
      )}
    >
      <AlertTriangle className="mb-2 h-5 w-5 text-muted-foreground" />
      <p className="mx-auto text-xs text-muted-foreground">
        {toMessage(error)}
      </p>
    </div>
  );
}
