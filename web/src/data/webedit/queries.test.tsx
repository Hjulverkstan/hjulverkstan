import { renderHook } from '@testing-library/react';
import { useLangCountQ } from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';

vi.mock('./api', () => ({
  createGetLangCount: vi.fn(({ entity }) => ({
    queryKey: ['web-edit/count', entity],
    queryFn: vi.fn(),
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('webedit queries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('useLangCountQ should call the api factory with entity', () => {
    renderHook(() => useLangCountQ({ entity: 'shop' }), { wrapper });
    expect(api.createGetLangCount).toHaveBeenCalledWith({ entity: 'shop' });
  });
});
