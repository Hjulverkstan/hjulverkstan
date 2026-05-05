import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createGetPublicVehicleById,
  createGetPublicVehiclesByLocation,
} from './api';
import { endpoints, instance } from '../api';

vi.mock('../api', () => ({
  instance: {
    get: vi.fn(),
  },
  endpoints: {
    site: {
      vehicle: '/site/vehicle',
    },
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('site api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createGetPublicVehiclesByLocation', () => {
    it('should return correct queryKey and fetch content by locationId', async () => {
      const config = createGetPublicVehiclesByLocation({ locationId: 'loc1' });
      expect(config.queryKey).toEqual([
        endpoints.site.vehicle,
        'location',
        'loc1',
      ]);

      (instance.get as any).mockResolvedValue({
        data: { content: ['v1', 'v2'] },
      });
      const result = await config.queryFn();

      expect(instance.get).toHaveBeenCalledWith('/site/vehicle/location/loc1');
      expect(result).toEqual(['v1', 'v2']);
    });

    it('should include undefined locationId in queryKey', () => {
      const config = createGetPublicVehiclesByLocation({
        locationId: undefined,
      });
      expect(config.queryKey).toEqual([
        endpoints.site.vehicle,
        'location',
        undefined,
      ]);
    });
  });

  describe('createGetPublicVehicleById', () => {
    it('should return correct queryKey and fetch a single vehicle by id', async () => {
      const config = createGetPublicVehicleById({ id: '123' });
      expect(config.queryKey).toEqual([endpoints.site.vehicle, '123']);

      (instance.get as any).mockResolvedValue({
        data: { id: '123', vehicleType: 'BIKE' },
      });
      const result = await config.queryFn();

      expect(instance.get).toHaveBeenCalledWith('/site/vehicle/123');
      expect(result).toEqual({ id: '123', vehicleType: 'BIKE' });
    });
  });
});
