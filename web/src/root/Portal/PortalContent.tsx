import { ReactNode } from 'react';

export interface PortalContentProps {
  children: ReactNode;
}

export default function PortalContent({ children }: PortalContentProps) {
  return <div className="flex min-h-0 flex-1 gap-4 pb-4">{children}</div>;
}
