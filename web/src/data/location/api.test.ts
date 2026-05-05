import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCreateLocation,
  createDeleteLocation,
  createEditLocation,
  createGetLocation,
  createGetLocations,
  createSoftDeleteLocation,
} from './api';
import { endpoints, instance } from '../api';

vi.mock('../api', () => ({
  instance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  endpoints: {
    location: '/location',
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('location api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetLocations should return correct queryKey and fetch content', async () => {
    const config = createGetLocations();
    expect(config.queryKey).toEqual([endpoints.location]);

    (instance.get as any).mockResolvedValue({
      data: { content: [{ id: '1' }] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(endpoints.location);
    expect(result).toEqual([{ id: '1' }]);
  });

  it('createGetLocation should return correct queryKey and fetch single location', async () => {
    const config = createGetLocation({ id: '123' });
    expect(config.queryKey).toEqual([endpoints.location, '123']);

    (instance.get as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/location/123');
    expect(result).toEqual({ id: '123' });
  });

  it('createCreateLocation should post to endpoint and return response data', async () => {
    const config = createCreateLocation();
    const body = { name: 'Store A', address: 'Main St' } as any;

    (instance.post as any).mockResolvedValue({ data: { id: 'new' } });
    const result = await config.mutationFn(body);

    expect(instance.post).toHaveBeenCalledWith(endpoints.location, body);
    expect(result).toEqual({ id: 'new' });
  });

  it('createEditLocation should put to /location/{id} with id stripped from body', async () => {
    const config = createEditLocation();
    const body = { id: '123', name: 'Updated Store', address: 'New St' } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith('/location/123', {
      name: 'Updated Store',
      address: 'New St',
    });
    expect(result).toEqual({ id: '123' });
  });

  it('createDeleteLocation should delete to /location/{id}/hard', async () => {
    const config = createDeleteLocation();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/location/123/hard');
    expect(result).toBe('ok');
  });

  it('createSoftDeleteLocation should delete to /location/{id} without /hard', async () => {
    const config = createSoftDeleteLocation();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/location/123');
    expect(result).toBe('ok');
  });
});
