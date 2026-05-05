import { renderHook, waitFor } from '@testing-library/react';
import { useTicketQ, useTicketsAsEnumsQ, useTicketsQ } from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';
import { TicketStatus, TicketType } from './types';

vi.mock('./api', () => ({
  createGetTickets: vi.fn(() => ({ queryKey: ['/ticket'], queryFn: vi.fn() })),
  createGetTicket: vi.fn(({ id }) => ({
    queryKey: ['/ticket', id],
    queryFn: vi.fn(),
  })),
}));

vi.mock('@hooks/useTranslateRawEnums', () => ({
  useTranslateRawEnums: vi.fn((enums) => enums),
}));

vi.mock('@utils/enums', () => ({
  findEnum: vi.fn(() => ({ icon: undefined })),
}));

vi.mock('@hooks/useAggregatedQueries', () => ({
  useAggregatedQueries: vi.fn(() => ({
    data: [],
    isSuccess: true,
    isLoading: false,
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('ticket queries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('useTicketsQ', () => {
    it('should return all tickets when no ticketIds filter is provided', async () => {
      (api.createGetTickets as any).mockReturnValue({
        queryKey: ['/ticket'],
        queryFn: () =>
          Promise.resolve([
            { id: 't1', ticketType: TicketType.REPAIR },
            { id: 't2', ticketType: TicketType.RENT },
          ]),
      });

      const { result } = renderHook(() => useTicketsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(2);
    });

    it('should filter to only matching ids when ticketIds is provided', async () => {
      (api.createGetTickets as any).mockReturnValue({
        queryKey: ['/ticket'],
        queryFn: () =>
          Promise.resolve([
            { id: 't1', ticketType: TicketType.REPAIR },
            { id: 't2', ticketType: TicketType.RENT },
            { id: 't3', ticketType: TicketType.DONATE },
          ]),
      });

      const { result } = renderHook(
        () => useTicketsQ({ ticketIds: ['t1', 't3'] }),
        { wrapper },
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.map((t) => t.id)).toEqual(['t1', 't3']);
    });
  });

  describe('useTicketQ', () => {
    it('should call the api factory when id is provided', () => {
      renderHook(() => useTicketQ({ id: '123' }), { wrapper });
      expect(api.createGetTicket).toHaveBeenCalledWith({ id: '123' });
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useTicketQ({ id: '' }), { wrapper });
      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('useTicketsAsEnumsQ', () => {
    it('should map tickets to EnumAttributes with label #id and value id', async () => {
      (api.createGetTickets as any).mockReturnValue({
        queryKey: ['/ticket'],
        queryFn: () =>
          Promise.resolve([
            {
              id: 't1',
              ticketType: TicketType.REPAIR,
              ticketStatus: TicketStatus.READY,
            },
          ]),
      });

      const { result } = renderHook(() => useTicketsAsEnumsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[0].label).toBe('#t1');
      expect(result.current.data?.[0].value).toBe('t1');
    });

    it('should assign the correct variant for each ticketStatus', async () => {
      (api.createGetTickets as any).mockReturnValue({
        queryKey: ['/ticket'],
        queryFn: () =>
          Promise.resolve([
            {
              id: 't1',
              ticketType: TicketType.REPAIR,
              ticketStatus: TicketStatus.READY,
            },
            {
              id: 't2',
              ticketType: TicketType.RENT,
              ticketStatus: TicketStatus.IN_PROGRESS,
            },
            {
              id: 't3',
              ticketType: TicketType.REPAIR,
              ticketStatus: TicketStatus.COMPLETE,
            },
            {
              id: 't4',
              ticketType: TicketType.RENT,
              ticketStatus: TicketStatus.CLOSED,
            },
          ]),
      });

      const { result } = renderHook(() => useTicketsAsEnumsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[0].variant).toBe('blue');
      expect(result.current.data?.[1].variant).toBe('yellow');
      expect(result.current.data?.[2].variant).toBe('purple');
      expect(result.current.data?.[3].variant).toBe('outline');
    });

    it('should apply a custom dataKey to each result', async () => {
      (api.createGetTickets as any).mockReturnValue({
        queryKey: ['/ticket'],
        queryFn: () =>
          Promise.resolve([{ id: 't1', ticketType: TicketType.REPAIR }]),
      });

      const { result } = renderHook(
        () => useTicketsAsEnumsQ({ dataKey: 'serviceTicket' }),
        { wrapper },
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[0].dataKey).toBe('serviceTicket');
    });
  });
});
