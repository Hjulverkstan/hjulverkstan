import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCreateEmployee,
  createDeleteEmployee,
  createEditEmployee,
  createGetEmployee,
  createGetEmployees,
  createSoftDeleteEmployee,
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
    employee: '/employee',
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('employee api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetEmployees should return correct query configuration', async () => {
    const config = createGetEmployees();
    expect(config.queryKey).toEqual(['/employee']);

    (instance.get as any).mockResolvedValue({
      data: { content: [{ id: '1' }] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/employee');
    expect(result).toEqual([{ id: '1' }]);
  });

  it('createGetEmployee should return correct query configuration', async () => {
    const config = createGetEmployee({ id: '123' });
    expect(config.queryKey).toEqual(['/employee', '123']);

    (instance.get as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith('/employee/123');
    expect(result).toEqual({ id: '123' });
  });

  it('createCreateEmployee should return correct mutation configuration', async () => {
    const config = createCreateEmployee();
    const body = { firstName: 'John', lastName: 'Doe' } as any;

    (instance.post as any).mockResolvedValue({ data: { id: 'new' } });
    const result = await config.mutationFn(body);

    expect(instance.post).toHaveBeenCalledWith('/employee', body);
    expect(result).toEqual({ id: 'new' });
  });

  it('createEditEmployee should return correct mutation configuration', async () => {
    const config = createEditEmployee();
    const body = { id: '123', firstName: 'Jane' } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith('/employee/123', body);
    expect(result).toEqual({ id: '123' });
  });

  it('createDeleteEmployee should return correct mutation configuration', async () => {
    const config = createDeleteEmployee();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/employee/123/purge');
    expect(result).toBe('ok');
  });

  it('createSoftDeleteEmployee should delete to endpoint without purge', async () => {
    const config = createSoftDeleteEmployee();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn('123');

    expect(instance.delete).toHaveBeenCalledWith('/employee/123');
    expect(result).toBe('ok');
  });
});
