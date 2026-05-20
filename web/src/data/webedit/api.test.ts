import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createGetLangCount, getAllWebEditEntitiesByLang } from './api';
import { endpoints, instance } from '../api';

vi.mock('../api', () => ({
  instance: {
    get: vi.fn(),
  },
  endpoints: {
    webedit: {
      all: '/web-edit/get-all',
      count: 'web-edit/count',
    },
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('webedit api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllWebEditEntitiesByLang', () => {
    it('should fetch and return entities', async () => {
      const entities = { sv: { text: {}, shops: [], stories: [] } };
      (instance.get as any).mockResolvedValue({ data: { entities } });

      const result = await getAllWebEditEntitiesByLang({ fallbackLang: 'en' });

      expect(instance.get).toHaveBeenCalledWith(
        endpoints.webedit.all,
        expect.objectContaining({
          params: { fallbackLang: 'en' },
          timeout: 150000,
        }),
      );
      expect(result).toEqual(entities);
    });

    it('should pass optional baseURL when provided', async () => {
      const entities = { sv: { text: {}, shops: [], stories: [] } };
      (instance.get as any).mockResolvedValue({ data: { entities } });

      await getAllWebEditEntitiesByLang(
        { fallbackLang: 'sv' },
        'https://custom.example.com',
      );

      expect(instance.get).toHaveBeenCalledWith(
        endpoints.webedit.all,
        expect.objectContaining({ baseURL: 'https://custom.example.com' }),
      );
    });
  });

  describe('createGetLangCount', () => {
    it('should return correct queryKey', () => {
      const config = createGetLangCount({ entity: 'shop' });
      expect(config.queryKey).toEqual([endpoints.webedit.count, 'shop']);
    });

    it('should fetch and return lang count data', async () => {
      const config = createGetLangCount({ entity: 'shop' });
      (instance.get as any).mockResolvedValue({ data: { sv: 5, en: 3 } });

      const result = await config.queryFn();

      expect(instance.get).toHaveBeenCalledWith(
        `${endpoints.webedit.count}/shop`,
      );
      expect(result).toEqual({ sv: 5, en: 3 });
    });
  });
});
