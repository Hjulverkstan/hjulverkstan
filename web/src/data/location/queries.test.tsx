import { renderHook, waitFor } from '@testing-library/react';
import { useLocationQ, useLocationsAsEnumsQ, useLocationsQ } from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';
import { LocationType } from './types';

vi.mock('./api', () => ({
  createGetLocations: vi.fn(() => ({
    queryKey: ['/location'],
    queryFn: vi.fn(),
  })),
  createGetLocation: vi.fn(({ id }) => ({
    queryKey: ['/location', id],
    queryFn: vi.fn(),
  })),
}));

vi.mock('@hooks/useTranslateRawEnums', () => ({
  useTranslateRawEnums: vi.fn((enums) => enums),
}));

vi.mock('@utils/enums', () => ({
  findEnum: vi.fn(() => ({ icon: undefined })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('location queries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('useLocationsQ', () => {
    it('should augment each location with vehicleCount from vehicleIds length', async () => {
      (api.createGetLocations as any).mockReturnValue({
        queryKey: ['/location'],
        queryFn: () =>
          Promise.resolve([
            { id: '1', name: 'Store A', vehicleIds: ['v1', 'v2', 'v3'] },
          ]),
      });

      const { result } = renderHook(() => useLocationsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect((result.current.data?.[0] as any).vehicleCount).toBe(3);
    });

    it('should set vehicleCount to 0 when vehicleIds is empty', async () => {
      (api.createGetLocations as any).mockReturnValue({
        queryKey: ['/location'],
        queryFn: () =>
          Promise.resolve([{ id: '1', name: 'Store A', vehicleIds: [] }]),
      });

      const { result } = renderHook(() => useLocationsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect((result.current.data?.[0] as any).vehicleCount).toBe(0);
    });
  });

  describe('useLocationQ', () => {
    it('should call the api factory when id is provided', () => {
      renderHook(() => useLocationQ({ id: '123' }), { wrapper });
      expect(api.createGetLocation).toHaveBeenCalledWith({ id: '123' });
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useLocationQ({ id: '' }), {
        wrapper,
      });
      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('useLocationsAsEnumsQ', () => {
    it('should map locations to EnumAttributes with label and value', async () => {
      (api.createGetLocations as any).mockReturnValue({
        queryKey: ['/location'],
        queryFn: () =>
          Promise.resolve([
            { id: 'loc1', name: 'Main Shop', locationType: LocationType.SHOP },
            {
              id: 'loc2',
              name: 'Warehouse',
              locationType: LocationType.STORAGE,
            },
          ]),
      });

      const { result } = renderHook(() => useLocationsAsEnumsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[0].label).toBe('Main Shop');
      expect(result.current.data?.[0].value).toBe('loc1');
      expect(result.current.data?.[1].label).toBe('Warehouse');
    });

    it('should filter to allowedTypes when provided', async () => {
      (api.createGetLocations as any).mockReturnValue({
        queryKey: ['/location'],
        queryFn: () =>
          Promise.resolve([
            { id: 'loc1', name: 'Main Shop', locationType: LocationType.SHOP },
            {
              id: 'loc2',
              name: 'Warehouse',
              locationType: LocationType.STORAGE,
            },
          ]),
      });

      const { result } = renderHook(
        () => useLocationsAsEnumsQ({ allowedTypes: [LocationType.SHOP] }),
        { wrapper },
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].value).toBe('loc1');
    });

    it('should apply a custom dataKey to each result', async () => {
      (api.createGetLocations as any).mockReturnValue({
        queryKey: ['/location'],
        queryFn: () =>
          Promise.resolve([
            { id: 'loc1', name: 'Shop', locationType: LocationType.SHOP },
          ]),
      });

      const { result } = renderHook(
        () => useLocationsAsEnumsQ({ dataKey: 'shopId' }),
        { wrapper },
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[0].dataKey).toBe('shopId');
    });
  });
});
