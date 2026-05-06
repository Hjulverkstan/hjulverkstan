import { renderHook } from '@testing-library/react';
import { useStoriesQ, useStoryQ } from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';
import { Lang } from '../types';

vi.mock('./api', () => ({
  createGetStories: vi.fn(({ lang }) => ({
    queryKey: ['/web-edit/story', lang],
    queryFn: vi.fn(),
  })),
  createGetStory: vi.fn(({ id, lang }) => ({
    queryKey: ['/web-edit/story', id, lang],
    queryFn: vi.fn(),
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('story query hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('useStoriesQ should call the api factory with lang', () => {
    renderHook(() => useStoriesQ({ lang: Lang.EN }), { wrapper });
    expect(api.createGetStories).toHaveBeenCalledWith({ lang: Lang.EN });
  });

  it('useStoryQ should not fetch when id is empty', () => {
    const { result } = renderHook(() => useStoryQ({ id: '', lang: Lang.EN }), {
      wrapper,
    });
    expect(result.current.isFetching).toBe(false);
  });
});
