import { renderHook } from '@testing-library/react';
import {
  useCreateEmployeeM,
  useDeleteEmployeeM,
  useEditEmployeeM,
  useSoftDeleteEmployeeM,
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
  createCreateEmployee: vi.fn(() => ({ mutationFn: vi.fn() })),
  createEditEmployee: vi.fn(() => ({ mutationFn: vi.fn() })),
  createDeleteEmployee: vi.fn(() => ({ mutationFn: vi.fn() })),
  createSoftDeleteEmployee: vi.fn(() => ({ mutationFn: vi.fn() })),
  createGetEmployees: vi.fn(() => ({ queryKey: ['/employee'] })),
  createGetEmployee: vi.fn(({ id }) => ({ queryKey: ['/employee', id] })),
}));

vi.mock('../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('employee mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateEmployeeM should invalidate list and single query on success', () => {
    renderHook(() => useCreateEmployeeM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: 'new-e' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/employee']);
    expect(keys).toContainEqual(['/employee', 'new-e']);
  });

  it('useEditEmployeeM should invalidate list and single query on success', () => {
    renderHook(() => useEditEmployeeM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: '123' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/employee']);
    expect(keys).toContainEqual(['/employee', '123']);
  });

  it('useDeleteEmployeeM should invalidate list only on success', () => {
    renderHook(() => useDeleteEmployeeM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/employee']);
    expect(keys).toHaveLength(1);
  });

  it('useSoftDeleteEmployeeM should invalidate list only on success', () => {
    renderHook(() => useSoftDeleteEmployeeM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/employee']);
    expect(keys).toHaveLength(1);
  });
});
