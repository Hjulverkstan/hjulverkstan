import { renderHook } from '@testing-library/react';
import { useShopQ, useShopsQ } from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';
import { Lang } from '../types';

vi.mock('./api', () => ({
  createGetShops: vi.fn(({ lang }) => ({
    queryKey: ['/web-edit/shop', lang],
    queryFn: vi.fn(),
  })),
  createGetShop: vi.fn(({ id, lang }) => ({
    queryKey: ['/web-edit/shop', id, lang],
    queryFn: vi.fn(),
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('shop query hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('useShopsQ should call the api factory with lang', () => {
    renderHook(() => useShopsQ({ lang: Lang.SV }), { wrapper });
    expect(api.createGetShops).toHaveBeenCalledWith({ lang: Lang.SV });
  });

  it('useShopQ should not fetch when id is empty', () => {
    const { result } = renderHook(() => useShopQ({ id: '', lang: Lang.SV }), {
      wrapper,
    });
    expect(result.current.isFetching).toBe(false);
  });
});
