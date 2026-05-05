import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCreateShop,
  createDeleteShop,
  createEditShop,
  createGetShop,
  createGetShops,
  createSoftDeleteShop,
} from './api';
import { endpoints, instance } from '../../api';
import { Lang } from '../types';

vi.mock('../../api', () => ({
  instance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  endpoints: {
    webedit: {
      shop: '/web-edit/shop',
    },
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('shop api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetShops should return correct queryKey and fetch content', async () => {
    const config = createGetShops({ lang: Lang.SV });
    expect(config.queryKey).toEqual([endpoints.webedit.shop, Lang.SV]);

    (instance.get as any).mockResolvedValue({
      data: { content: [{ id: 's1' }] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(endpoints.webedit.shop, {
      params: { lang: Lang.SV },
    });
    expect(result).toEqual([{ id: 's1' }]);
  });

  it('createGetShop should return correct queryKey and fetch single shop', async () => {
    const config = createGetShop({ id: '123', lang: Lang.SV });
    expect(config.queryKey).toEqual([endpoints.webedit.shop, '123', Lang.SV]);

    (instance.get as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(`${endpoints.webedit.shop}/123`, {
      params: { lang: Lang.SV },
    });
    expect(result).toEqual({ id: '123' });
  });

  it('createCreateShop should post with lang as query param and body without lang', async () => {
    const config = createCreateShop();
    const body = { lang: Lang.SV, name: 'Test Shop', locationId: '1' } as any;

    (instance.post as any).mockResolvedValue({ data: { id: 'new' } });
    const result = await config.mutationFn(body);

    expect(instance.post).toHaveBeenCalledWith(
      endpoints.webedit.shop,
      { name: 'Test Shop', locationId: '1' },
      { params: { lang: Lang.SV } },
    );
    expect(result).toEqual({ id: 'new' });
  });

  it('createEditShop should put to /shop/{id} with lang as query param and id stripped from body', async () => {
    const config = createEditShop();
    const body = { id: '123', lang: Lang.SV, name: 'Updated' } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '123' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith(
      `${endpoints.webedit.shop}/123`,
      { name: 'Updated' },
      { params: { lang: Lang.SV } },
    );
    expect(result).toEqual({ id: '123' });
  });

  it('createDeleteShop should delete to /shop/{id}/hard with lang param', async () => {
    const config = createDeleteShop();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn({ id: '123', lang: Lang.SV });

    expect(instance.delete).toHaveBeenCalledWith(
      `${endpoints.webedit.shop}/123/hard`,
      {
        params: { lang: Lang.SV },
      },
    );
    expect(result).toBe('ok');
  });

  it('createSoftDeleteShop should delete to /shop/{id} without /hard', async () => {
    const config = createSoftDeleteShop();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn({ id: '123', lang: Lang.SV });

    expect(instance.delete).toHaveBeenCalledWith(
      `${endpoints.webedit.shop}/123`,
      {
        params: { lang: Lang.SV },
      },
    );
    expect(result).toBe('ok');
  });
});
