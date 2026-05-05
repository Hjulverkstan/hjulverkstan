import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCreateUser,
  createDeleteUser,
  createEditUser,
  createGetUser,
  createGetUsers,
  createSoftDeleteUser,
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
    user: '/user',
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('user api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetUsers should return correct queryKey and fetch content', async () => {
    const config = createGetUsers();
    expect(config.queryKey).toEqual([endpoints.user]);

    (instance.get as any).mockResolvedValue({
      data: { content: [{ id: 'u1' }] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(endpoints.user);
    expect(result).toEqual([{ id: 'u1' }]);
  });

  it('createGetUser should return correct queryKey and fetch single user', async () => {
    const config = createGetUser({ id: '123' });
    expect(config.queryKey).toEqual([endpoints.user, '123']);

    (instance.get as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/user/123');
    expect(result).toEqual({ id: '123' });
  });

  it('createCreateUser should post to endpoint and return response data', async () => {
    const config = createCreateUser();
    const body = { username: 'john', email: 'john@example.com' } as any;

    (instance.post as any).mockResolvedValue({ data: { id: 'new' } });
    const result = await config.mutationFn(body);

    expect(instance.post).toHaveBeenCalledWith(endpoints.user, body);
    expect(result).toEqual({ id: 'new' });
  });

  it('createEditUser should put to /user/{id} with id stripped from body', async () => {
    const config = createEditUser();
    const body = {
      id: '123',
      username: 'updated',
      email: 'u@example.com',
    } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith('/user/123', {
      username: 'updated',
      email: 'u@example.com',
    });
    expect(result).toEqual({ id: '123' });
  });

  it('createSoftDeleteUser should delete to /user/{id} without /hard', async () => {
    const config = createSoftDeleteUser();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/user/123');
    expect(result).toBe('ok');
  });

  it('createDeleteUser should delete to /user/{id}/hard', async () => {
    const config = createDeleteUser();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/user/123/hard');
    expect(result).toBe('ok');
  });
});
