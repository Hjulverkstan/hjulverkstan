import { ReactNode } from 'react';

export interface PortalContentProps {
  children: ReactNode;
}

export default function PortalContent({ children }: PortalContentProps) {
  return <div className="flex items-start gap-4">{children}</div>;
}
