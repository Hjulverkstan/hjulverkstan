import { renderHook } from '@testing-library/react';
import {
  useCreateVehicleM,
  useDeleteVehicleM,
  useEditVehicleM,
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
    expect(
      invCalls.some(
        (call: any) =>
          call[0].some(
            (k: any) => JSON.stringify(k) === JSON.stringify(['vehicles']),
          ) &&
          call[0].some(
            (k: any) =>
              JSON.stringify(k) === JSON.stringify(['vehicle', '123']),
          ),
      ),
    ).toBe(true);
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
    expect(
      invCalls.some((call: any) =>
        call[0].some(
          (k: any) => JSON.stringify(k) === JSON.stringify(['vehicles']),
        ),
      ),
    ).toBe(true);
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
    expect(
      invCalls.some(
        (call: any) =>
          call[0].some(
            (k: any) => JSON.stringify(k) === JSON.stringify(['vehicles']),
          ) &&
          call[0].some(
            (k: any) =>
              JSON.stringify(k) === JSON.stringify(['vehicle', '123']),
          ),
      ),
    ).toBe(true);
  });
});
