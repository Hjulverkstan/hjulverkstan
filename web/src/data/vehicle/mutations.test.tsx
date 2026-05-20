import { renderHook } from '@testing-library/react';
import {
  useCreateVehicleM,
  useDeleteVehicleM,
  useEditVehicleM,
  useSoftDeleteVehicleM,
  useUpdateVehicleStatusM,
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
  createCreateVehicle: vi.fn(() => ({
    mutationFn: vi.fn(),
    queryKey: ['vehicles'],
  })),
  createEditVehicle: vi.fn(() => ({
    mutationFn: vi.fn(),
    queryKey: ['vehicles'],
  })),
  createDeleteVehicle: vi.fn(() => ({
    mutationFn: vi.fn(),
    queryKey: ['vehicles'],
  })),
  createSoftDeleteVehicle: vi.fn(() => ({
    mutationFn: vi.fn(),
    queryKey: ['vehicles'],
  })),
  createUpdateVehicleStatus: vi.fn(() => ({
    mutationFn: vi.fn(),
    queryKey: ['vehicles'],
  })),
  createGetVehicles: vi.fn(() => ({ queryKey: ['vehicles'] })),
  createGetVehicle: vi.fn(({ id }) => ({ queryKey: ['vehicle', id] })),
}));

vi.mock('../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('vehicle mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateVehicleM should invalidate queries on success', async () => {
    renderHook(() => useCreateVehicleM(), { wrapper });

    const calls = (reactQuery.useMutation as any).mock.calls;
    const onSuccess = calls[calls.length - 1][0]?.onSuccess;
    if (onSuccess) {
      onSuccess({ id: 'new-v' });
    }

    expect(invalidateQueries).toHaveBeenCalled();
    const invCalls = (invalidateQueries as any).mock.calls;
    expect(invCalls[0][0]).toContainEqual(['vehicles']);
    expect(invCalls[0][0]).toContainEqual(['vehicle', 'new-v']);
  });

  it('useEditVehicleM should invalidate queries on success', async () => {
    renderHook(() => useEditVehicleM(), { wrapper });

    const calls = (reactQuery.useMutation as any).mock.calls;
    const onSuccess = calls[calls.length - 1][0]?.onSuccess;
    if (onSuccess) {
      onSuccess({ id: '123' });
    }

    expect(invalidateQueries).toHaveBeenCalled();
    const invCalls = (invalidateQueries as any).mock.calls;
    expect(invCalls[0][0]).toContainEqual(['vehicles']);
    expect(invCalls[0][0]).toContainEqual(['vehicle', '123']);
  });

  it('useDeleteVehicleM should invalidate list query on success', async () => {
    renderHook(() => useDeleteVehicleM(), { wrapper });

    const calls = (reactQuery.useMutation as any).mock.calls;
    const onSuccess = calls[calls.length - 1][0]?.onSuccess;
    if (onSuccess) {
      onSuccess();
    }

    expect(invalidateQueries).toHaveBeenCalled();
    const invCalls = (invalidateQueries as any).mock.calls;
    expect(invCalls[0][0]).toContainEqual(['vehicles']);
  });

  it('useSoftDeleteVehicleM should invalidate list query on success', () => {
    renderHook(() => useSoftDeleteVehicleM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['vehicles']);
    expect(keys).toHaveLength(1);
  });

  it('useUpdateVehicleStatusM should invalidate queries on success', async () => {
    renderHook(() => useUpdateVehicleStatusM(), { wrapper });

    const calls = (reactQuery.useMutation as any).mock.calls;
    const onSuccess = calls[calls.length - 1][0]?.onSuccess;
    if (onSuccess) {
      onSuccess({ id: '123' });
    }

    expect(invalidateQueries).toHaveBeenCalled();
    const invCalls = (invalidateQueries as any).mock.calls;
    expect(invCalls[0][0]).toContainEqual(['vehicles']);
    expect(invCalls[0][0]).toContainEqual(['vehicle', '123']);
  });
});
