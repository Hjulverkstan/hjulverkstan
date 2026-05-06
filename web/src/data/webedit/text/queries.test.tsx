import { renderHook } from '@testing-library/react';
import { useTextQ, useTextsQ } from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';
import { Lang } from '../types';

vi.mock('./api', () => ({
  createGetTexts: vi.fn(({ lang }) => ({
    queryKey: ['/web-edit/text', lang],
    queryFn: vi.fn(),
  })),
  createGetText: vi.fn(({ id, lang }) => ({
    queryKey: ['/web-edit/text', id, lang],
    queryFn: vi.fn(),
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('text query hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('useTextsQ should call the api factory with lang', () => {
    renderHook(() => useTextsQ({ lang: Lang.SV }), { wrapper });
    expect(api.createGetTexts).toHaveBeenCalledWith({ lang: Lang.SV });
  });

  it('useTextQ should not fetch when id is empty', () => {
    const { result } = renderHook(() => useTextQ({ id: '', lang: Lang.SV }), {
      wrapper,
    });
    expect(result.current.isFetching).toBe(false);
  });
});
