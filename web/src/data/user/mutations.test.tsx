import { renderHook } from '@testing-library/react';
import {
  useCreateUserM,
  useDeleteUserM,
  useEditUserM,
  useSoftDeleteUserM,
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
  createCreateUser: vi.fn(() => ({ mutationFn: vi.fn() })),
  createEditUser: vi.fn(() => ({ mutationFn: vi.fn() })),
  createSoftDeleteUser: vi.fn(() => ({ mutationFn: vi.fn() })),
  createDeleteUser: vi.fn(() => ({ mutationFn: vi.fn() })),
  createGetUsers: vi.fn(() => ({ queryKey: ['/user'] })),
  createGetUser: vi.fn(({ id }) => ({ queryKey: ['/user', id] })),
}));

vi.mock('../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('user mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateUserM should invalidate list and single query on success', () => {
    renderHook(() => useCreateUserM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: 'new-u' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/user']);
    expect(keys).toContainEqual(['/user', 'new-u']);
  });

  it('useEditUserM should invalidate list and single query on success', () => {
    renderHook(() => useEditUserM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: '123' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/user']);
    expect(keys).toContainEqual(['/user', '123']);
  });

  it('useSoftDeleteUserM should invalidate list only on success', () => {
    renderHook(() => useSoftDeleteUserM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/user']);
    expect(keys).toHaveLength(1);
  });

  it('useDeleteUserM should invalidate list only on success', () => {
    renderHook(() => useDeleteUserM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/user']);
    expect(keys).toHaveLength(1);
  });
});
