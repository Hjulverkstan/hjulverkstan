import { ReactNode } from 'react';

import PageNavbar from '@components/PageNavbar';
import PageFooter from '@components/PageFooter';

export interface PageProps {
  children: ReactNode;
}

export const Page = ({ children }: PageProps) => (
  <>
    <PageNavbar />
    <div className="mt-16">
      {children}
    </div>
    <PageFooter />
  </>
)