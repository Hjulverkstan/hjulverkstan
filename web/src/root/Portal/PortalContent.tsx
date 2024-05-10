import { ReactNode } from 'react';

export interface PortalContentProps {
  children: ReactNode;
}

export default function PortalContent({ children }: PortalContentProps) {
  return (
    <div
      className="bg-background css-glow-shadow mb-4 flex min-h-0 flex-1
        overflow-hidden rounded-md border"
    >
      {children}
    </div>
  );
}
