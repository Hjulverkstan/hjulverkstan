import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCreateVehicle,
  createDeleteVehicle,
  createEditVehicle,
  createGetVehicle,
  createGetVehicles,
  createSoftDeleteVehicle,
  createUpdateVehicleStatus,
} from './api';
import { instance } from '../api';
import { VehicleStatus, VehicleType } from './types';

vi.mock('../api', () => ({
  instance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  endpoints: {
    vehicle: '/vehicle',
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('vehicle api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetVehicles should return correct query configuration', async () => {
    const config = createGetVehicles();
    expect(config.queryKey).toEqual(['/vehicle']);

    (instance.get as any).mockResolvedValue({
      data: { content: ['v1', 'v2'] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/vehicle');
    expect(result).toEqual(['v1', 'v2']);
  });

  it('createGetVehicle should return correct query configuration', async () => {
    const config = createGetVehicle({ id: '123' });
    expect(config.queryKey).toEqual(['/vehicle', '123']);

    (instance.get as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/vehicle/123');
    expect(result).toEqual({ id: '123' });
  });

  it('createCreateVehicle should return correct mutation configuration', async () => {
    const config = createCreateVehicle();
    const body = { vehicleType: VehicleType.BIKE, locationId: '1' } as any;

    (instance.post as any).mockResolvedValue({ data: { id: 'new' } });
    const result = await config.mutationFn(body);

    expect(instance.post).toHaveBeenCalledWith('/vehicle', body);
    expect(result).toEqual({ id: 'new' });
  });

  it('createEditVehicle should return correct mutation configuration', async () => {
    const config = createEditVehicle();
    const body = { id: '123', vehicleType: VehicleType.BIKE } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith('/vehicle/123', {
      vehicleType: VehicleType.BIKE,
    });
    expect(result).toEqual({ id: '123' });
  });

  it('createUpdateVehicleStatus should return correct mutation configuration', async () => {
    const config = createUpdateVehicleStatus();
    (instance.put as any).mockResolvedValue({
      data: { id: '123', status: VehicleStatus.AVAILABLE },
    });

    const result = await config.mutationFn({
      id: '123',
      vehicleStatus: VehicleStatus.AVAILABLE,
    });

    expect(instance.put).toHaveBeenCalledWith('/vehicle/123/status', {
      vehicleStatus: VehicleStatus.AVAILABLE,
    });
    expect(result.status).toBe(VehicleStatus.AVAILABLE);
  });

  it('createDeleteVehicle should return correct mutation configuration', async () => {
    const config = createDeleteVehicle();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/vehicle/123/hard');
    expect(result).toBe('ok');
  });

  it('createSoftDeleteVehicle should return correct mutation configuration', async () => {
    const config = createSoftDeleteVehicle();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/vehicle/123');
    expect(result).toBe('ok');
  });
});
