import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

import { vi } from 'vitest';

// Runs a cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock shadcn Tooltip globally to avoid TooltipProvider errors in all tests using Button
vi.mock('@components/shadcn/Tooltip', () => ({
  Provider: ({ children }: any) => <>{children}</>,
  Root: ({ children }: any) => <>{children}</>,
  Trigger: ({ children }: any) => <>{children}</>,
  Content: ({ children }: any) => (
    <div data-testid="tooltip-content">{children}</div>
  ),
}));
