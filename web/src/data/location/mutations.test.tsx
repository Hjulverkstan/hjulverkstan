import { renderHook } from '@testing-library/react';
import {
  useCreateLocationM,
  useDeleteLocationM,
  useEditLocationM,
  useSoftDeleteLocationM,
} from './mutations';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as reactQuery from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { invalidateQueries } from '../queries';

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
  createCreateLocation: vi.fn(() => ({ mutationFn: vi.fn() })),
  createEditLocation: vi.fn(() => ({ mutationFn: vi.fn() })),
  createDeleteLocation: vi.fn(() => ({ mutationFn: vi.fn() })),
  createSoftDeleteLocation: vi.fn(() => ({ mutationFn: vi.fn() })),
  createGetLocations: vi.fn(() => ({ queryKey: ['/location'] })),
  createGetLocation: vi.fn(({ id }) => ({ queryKey: ['/location', id] })),
}));

vi.mock('../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('location mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateLocationM should invalidate list and single query on success', () => {
    renderHook(() => useCreateLocationM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: 'new-loc' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/location']);
    expect(keys).toContainEqual(['/location', 'new-loc']);
  });

  it('useEditLocationM should invalidate list and single query on success', () => {
    renderHook(() => useEditLocationM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: '123' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/location']);
    expect(keys).toContainEqual(['/location', '123']);
  });

  it('useDeleteLocationM should invalidate list only on success', () => {
    renderHook(() => useDeleteLocationM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/location']);
    expect(keys).toHaveLength(1);
  });

  it('useSoftDeleteLocationM should invalidate list only on success', () => {
    renderHook(() => useSoftDeleteLocationM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/location']);
    expect(keys).toHaveLength(1);
  });
});
