import { renderHook } from '@testing-library/react';
import {
  useCreateCustomerM,
  useEditCustomerM,
  useHardDeleteCustomerM,
  useSoftDeleteCustomerM,
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
  createCreateCustomer: vi.fn(() => ({ mutationFn: vi.fn() })),
  createEditCustomer: vi.fn(() => ({ mutationFn: vi.fn() })),
  createDeleteCustomer: vi.fn(() => ({ mutationFn: vi.fn() })),
  createSoftDeleteCustomer: vi.fn(() => ({ mutationFn: vi.fn() })),
  createGetCustomers: vi.fn(() => ({ queryKey: ['/customer'] })),
  createGetCustomer: vi.fn(({ id }) => ({ queryKey: ['/customer', id] })),
}));

vi.mock('../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('customer mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateCustomerM should invalidate list and single query on success', () => {
    renderHook(() => useCreateCustomerM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: 'new-c' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/customer']);
    expect(keys).toContainEqual(['/customer', 'new-c']);
  });

  it('useEditCustomerM should invalidate list and single query on success', () => {
    renderHook(() => useEditCustomerM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: '123' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/customer']);
    expect(keys).toContainEqual(['/customer', '123']);
  });

  it('useHardDeleteCustomerM should invalidate list only on success', () => {
    renderHook(() => useHardDeleteCustomerM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/customer']);
    expect(keys).toHaveLength(1);
  });

  it('useSoftDeleteCustomerM should invalidate list only on success', () => {
    renderHook(() => useSoftDeleteCustomerM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/customer']);
    expect(keys).toHaveLength(1);
  });
});
