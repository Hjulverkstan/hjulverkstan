import { renderHook } from '@testing-library/react';
import {
  useCreateTicketM,
  useDeleteTicketM,
  useEditTicketM,
  useSoftDeleteTicketM,
  useUpdateTicketStatusM,
} from './mutations';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as reactQuery from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { invalidateQueries } from '../queries';
import { TicketStatus } from './types';

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
  createCreateTicket: vi.fn(() => ({ mutationFn: vi.fn() })),
  createEditTicket: vi.fn(() => ({ mutationFn: vi.fn() })),
  createSoftDeleteTicket: vi.fn(() => ({ mutationFn: vi.fn() })),
  createDeleteTicket: vi.fn(() => ({ mutationFn: vi.fn() })),
  createUpdateTicketStatus: vi.fn(() => ({ mutationFn: vi.fn() })),
  createGetTickets: vi.fn(() => ({ queryKey: ['/ticket'] })),
  createGetTicket: vi.fn(({ id }) => ({ queryKey: ['/ticket', id] })),
}));

vi.mock('../customer/api', () => ({
  createGetCustomers: vi.fn(() => ({ queryKey: ['/customer'] })),
}));

vi.mock('../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ticket mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateTicketM should invalidate ticket list and single on success', () => {
    renderHook(() => useCreateTicketM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: 'new-t' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/ticket']);
    expect(keys).toContainEqual(['/ticket', 'new-t']);
  });

  it('useEditTicketM should invalidate ticket list and single on success', () => {
    renderHook(() => useEditTicketM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: '123' });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/ticket']);
    expect(keys).toContainEqual(['/ticket', '123']);
  });

  it('useSoftDeleteTicketM should invalidate tickets AND customers list on success', () => {
    renderHook(() => useSoftDeleteTicketM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/ticket']);
    expect(keys).toContainEqual(['/customer']);
  });

  it('useDeleteTicketM should invalidate tickets AND customers list on success', () => {
    renderHook(() => useDeleteTicketM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.();

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/ticket']);
    expect(keys).toContainEqual(['/customer']);
  });

  it('useUpdateTicketStatusM should invalidate ticket list and single using variables id', () => {
    renderHook(() => useUpdateTicketStatusM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({}, { id: '123', ticketStatus: TicketStatus.READY });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/ticket']);
    expect(keys).toContainEqual(['/ticket', '123']);
  });
});
