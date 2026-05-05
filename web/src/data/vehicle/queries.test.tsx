import { renderHook, waitFor } from '@testing-library/react';
import {
  useVehicleQ,
  useVehiclesAggregatedQ,
  useVehiclesAsEnumsQ,
  useVehiclesQ,
} from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';
import { useTicketsQ } from '../ticket/queries';
import { VehicleType } from './types';
import { TicketStatus, TicketType } from '../ticket/types';

vi.mock('./api', () => ({
  createGetVehicles: vi.fn(() => ({
    queryKey: ['vehicles'],
    queryFn: vi.fn(),
  })),
  createGetVehicle: vi.fn(({ id }) => ({
    queryKey: ['vehicle', id],
    queryFn: vi.fn(),
  })),
}));

vi.mock('../ticket/queries', () => ({
  useTicketsQ: vi.fn(),
}));

vi.mock('@hooks/useTranslateRawEnums', () => ({
  useTranslateRawEnums: vi.fn((enums) => enums),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('vehicle queries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('useVehiclesQ should call api factory', () => {
    renderHook(() => useVehiclesQ(), { wrapper });
    expect(api.createGetVehicles).toHaveBeenCalled();
  });

  it('useVehicleQ should call api factory if id provided', () => {
    renderHook(() => useVehicleQ({ id: '123' }), { wrapper });
    expect(api.createGetVehicle).toHaveBeenCalledWith({ id: '123' });
  });

  it('useVehiclesAggregatedQ should aggregate vehicle and ticket data', async () => {
    const mockVehicles = [
      {
        id: 'v1',
        ticketIds: ['t1'],
        isCustomerOwned: true,
        vehicleType: VehicleType.BIKE,
      },
    ];
    const mockTickets = [
      {
        id: 't1',
        ticketType: TicketType.REPAIR,
        ticketStatus: TicketStatus.DONE,
      },
    ];

    (api.createGetVehicles as any).mockReturnValue({
      queryKey: ['vehicles'],
      queryFn: () => Promise.resolve(mockVehicles),
    });
    (useTicketsQ as any).mockReturnValue({
      data: mockTickets,
      isSuccess: true,
    });

    const { result } = renderHook(() => useVehiclesAggregatedQ(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toHaveLength(1);
    expect(result.current.data?.[0].ticketTypes).toContain(TicketType.REPAIR);
  });

  describe('useVehiclesAsEnumsQ', () => {
    it('should filter and transform vehicles to enums', async () => {
      const mockVehicles = [
        {
          id: 'v1',
          isCustomerOwned: true,
          vehicleType: VehicleType.BIKE,
          locationId: 'L1',
          regTag: 'ABC',
        },
        {
          id: 'v2',
          isCustomerOwned: false,
          vehicleType: VehicleType.SCOOTER,
          locationId: 'L2',
          regTag: 'XYZ',
        },
      ];

      (api.createGetVehicles as any).mockReturnValue({
        queryKey: ['vehicles'],
        queryFn: () => Promise.resolve(mockVehicles),
      });

      const { result } = renderHook(
        () => useVehiclesAsEnumsQ({ showOrgBikes: true }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].value).toBe('v2');
      expect(result.current.data?.[0].label).toBe('XYZ');
    });
  });
});
