import { renderHook } from '@testing-library/react';
import {
  useCreateShopM,
  useDeleteShopM,
  useEditShopM,
  useSoftDeleteShopM,
} from './mutations';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as reactQuery from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { invalidateQueries } from '../../queries';
import { Lang } from '../types';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: vi
      .fn()
      .mockReturnValue({ mutate: vi.fn(), mutateAsync: vi.fn() }),
  };
});

vi.mock('./api', () => ({
  createCreateShop: vi.fn(() => ({ mutationFn: vi.fn() })),
  createEditShop: vi.fn(() => ({ mutationFn: vi.fn() })),
  createDeleteShop: vi.fn(() => ({ mutationFn: vi.fn() })),
  createSoftDeleteShop: vi.fn(() => ({ mutationFn: vi.fn() })),
  createGetShops: vi.fn(({ lang }) => ({ queryKey: ['/web-edit/shop', lang] })),
  createGetShop: vi.fn(({ id, lang }) => ({
    queryKey: ['/web-edit/shop', id, lang],
  })),
}));

vi.mock('../../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('shop mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateShopM should invalidate list and single query on success', () => {
    renderHook(() => useCreateShopM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: 'new-s' }, { lang: Lang.SV });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/shop', Lang.SV]);
    expect(keys).toContainEqual(['/web-edit/shop', 'new-s', Lang.SV]);
  });

  it('useEditShopM should invalidate list and single query on success', () => {
    renderHook(() => useEditShopM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: '123' }, { lang: Lang.SV });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/shop', Lang.SV]);
    expect(keys).toContainEqual(['/web-edit/shop', '123', Lang.SV]);
  });

  it('useDeleteShopM should invalidate list only on success', () => {
    renderHook(() => useDeleteShopM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.(undefined, { lang: Lang.SV });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/shop', Lang.SV]);
    expect(keys).toHaveLength(1);
  });

  it('useSoftDeleteShopM should invalidate list only on success', () => {
    renderHook(() => useSoftDeleteShopM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.(undefined, { lang: Lang.SV });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/shop', Lang.SV]);
    expect(keys).toHaveLength(1);
  });
});
