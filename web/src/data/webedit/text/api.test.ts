import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createDeleteText,
  createEditText,
  createGetText,
  createGetTexts,
} from './api';
import { endpoints, instance } from '../../api';
import { Lang } from '../types';

vi.mock('../../api', () => ({
  instance: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
  endpoints: {
    webedit: {
      text: '/web-edit/text',
    },
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('text api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetTexts should return correct queryKey and fetch content', async () => {
    const config = createGetTexts({ lang: Lang.SV });
    expect(config.queryKey).toEqual([endpoints.webedit.text, Lang.SV]);

    (instance.get as any).mockResolvedValue({
      data: { content: [{ id: 't1' }] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(endpoints.webedit.text, {
      params: { lang: Lang.SV },
    });
    expect(result).toEqual([{ id: 't1' }]);
  });

  it('createGetText should return correct queryKey and fetch single text', async () => {
    const config = createGetText({ id: '789', lang: Lang.SV });
    expect(config.queryKey).toEqual([endpoints.webedit.text, '789', Lang.SV]);

    (instance.get as any).mockResolvedValue({ data: { id: '789' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(`${endpoints.webedit.text}/789`, {
      params: { lang: Lang.SV },
    });
    expect(result).toEqual({ id: '789' });
  });

  it('createEditText should put to /text/{id} with lang as query param and id stripped from body', async () => {
    const config = createEditText();
    const body = { id: '789', lang: Lang.SV, value: 'Updated text' } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '789' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith(
      `${endpoints.webedit.text}/789`,
      { value: 'Updated text' },
      { params: { lang: Lang.SV } },
    );
    expect(result).toEqual({ id: '789' });
  });

  it('createDeleteText should delete to /text/{id} with lang param', async () => {
    const config = createDeleteText();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn({ id: '789', lang: Lang.SV });

    expect(instance.delete).toHaveBeenCalledWith(
      `${endpoints.webedit.text}/789`,
      {
        params: { lang: Lang.SV },
      },
    );
    expect(result).toBe('ok');
  });
});
