import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createCreateStory,
  createDeleteStory,
  createEditStory,
  createGetStories,
  createGetStory,
  createSoftDeleteStory,
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
      story: '/web-edit/story',
    },
  },
  createErrorHandler: vi.fn(
    (endpoint) => (err: any) => Promise.reject({ endpoint, ...err }),
  ),
}));

describe('story api factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createGetStories should return correct queryKey and fetch content', async () => {
    const config = createGetStories({ lang: Lang.EN });
    expect(config.queryKey).toEqual([endpoints.webedit.story, Lang.EN]);

    (instance.get as any).mockResolvedValue({
      data: { content: [{ id: 'st1' }] },
    });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(endpoints.webedit.story, {
      params: { lang: Lang.EN },
    });
    expect(result).toEqual([{ id: 'st1' }]);
  });

  it('createGetStory should return correct queryKey and fetch single story', async () => {
    const config = createGetStory({ id: '456', lang: Lang.EN });
    expect(config.queryKey).toEqual([endpoints.webedit.story, '456', Lang.EN]);

    (instance.get as any).mockResolvedValue({ data: { id: '456' } });
    const result = await config.queryFn();

    expect(instance.get).toHaveBeenCalledWith(
      `${endpoints.webedit.story}/456`,
      { params: { lang: Lang.EN } },
    );
    expect(result).toEqual({ id: '456' });
  });

  it('createCreateStory should post with lang as query param and body without lang', async () => {
    const config = createCreateStory();
    const body = { lang: Lang.EN, title: 'A Story', slug: 'a-story' } as any;

    (instance.post as any).mockResolvedValue({ data: { id: 'new' } });
    const result = await config.mutationFn(body);

    expect(instance.post).toHaveBeenCalledWith(
      endpoints.webedit.story,
      { title: 'A Story', slug: 'a-story' },
      { params: { lang: Lang.EN } },
    );
    expect(result).toEqual({ id: 'new' });
  });

  it('createEditStory should put to /story/{id} with lang as query param and id stripped from body', async () => {
    const config = createEditStory();
    const body = { id: '456', lang: Lang.EN, title: 'Updated' } as any;

    (instance.put as any).mockResolvedValue({ data: { id: '456' } });
    const result = await config.mutationFn(body);

    expect(instance.put).toHaveBeenCalledWith(
      `${endpoints.webedit.story}/456`,
      { title: 'Updated' },
      { params: { lang: Lang.EN } },
    );
    expect(result).toEqual({ id: '456' });
  });

  it('createDeleteStory should delete to /story/{id}/hard with lang param', async () => {
    const config = createDeleteStory();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn({ id: '456', lang: Lang.EN });

    expect(instance.delete).toHaveBeenCalledWith(
      `${endpoints.webedit.story}/456/hard`,
      {
        params: { lang: Lang.EN },
      },
    );
    expect(result).toBe('ok');
  });

  it('createSoftDeleteStory should delete to /story/{id} without /hard', async () => {
    const config = createSoftDeleteStory();
    (instance.delete as any).mockResolvedValue({ data: 'ok' });

    const result = await config.mutationFn({ id: '456', lang: Lang.EN });

    expect(instance.delete).toHaveBeenCalledWith(
      `${endpoints.webedit.story}/456`,
      {
        params: { lang: Lang.EN },
      },
    );
    expect(result).toBe('ok');
  });
});
