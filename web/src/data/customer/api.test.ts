import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCreateCustomer,
  createDeleteCustomer,
  createEditCustomer,
  createGetCustomer,
  createGetCustomers,
  createSoftDeleteCustomer,
} from './api';
import { instance } from '../api';

vi.mock('../api', () => ({
  instance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  endpoints: {
    customer: '/customer',
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('customer api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetCustomers should return correct query configuration', async () => {
    const config = createGetCustomers();
    expect(config.queryKey).toEqual(['/customer']);

    (instance.get as any).mockResolvedValue({
      data: { content: [{ id: '1' }] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/customer');
    expect(result).toEqual([{ id: '1' }]);
  });

  it('createGetCustomer should return correct query configuration', async () => {
    const config = createGetCustomer({ id: '123' });
    expect(config.queryKey).toEqual(['/customer', '123']);

    (instance.get as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/customer/123');
    expect(result).toEqual({ id: '123' });
  });

  it('createCreateCustomer should return correct mutation configuration', async () => {
    const config = createCreateCustomer();
    const body = { firstName: 'John', lastName: 'Doe' } as any;

    (instance.post as any).mockResolvedValue({ data: { id: 'new' } });
    const result = await config.mutationFn(body);

    expect(instance.post).toHaveBeenCalledWith('/customer', body);
    expect(result).toEqual({ id: 'new' });
  });

  it('createEditCustomer should return correct mutation configuration', async () => {
    const config = createEditCustomer();
    const body = { id: '123', firstName: 'Jane' } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith('/customer/123', {
      firstName: 'Jane',
    });
    expect(result).toEqual({ id: '123' });
  });

  it('createDeleteCustomer should return correct mutation configuration', async () => {
    const config = createDeleteCustomer();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/customer/123/purge');
    expect(result).toBe('ok');
  });

  it('createSoftDeleteCustomer should return correct mutation configuration', async () => {
    const config = createSoftDeleteCustomer();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/customer/123');
    expect(result).toBe('ok');
  });
});
