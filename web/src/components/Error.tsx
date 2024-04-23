import { AlertTriangle } from 'lucide-react';

import * as api from '@api';

import Message from './Message';

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
    <Message
      icon={AlertTriangle}
      message={toMessage(error)}
      className={className}
    />
  );
}
