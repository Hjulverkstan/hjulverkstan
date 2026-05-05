import { renderHook } from '@testing-library/react';
import {
  useCreateStoryM,
  useDeleteStoryM,
  useEditStoryM,
  useSoftDeleteStoryM,
} from './mutations';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as reactQuery from '@tanstack/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { invalidateQueries } from '../../queries';
import { Lang } from '../types';

vi.mock('@tanstack/react-query', async () => {
  const actual = await vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useMutation: vi
      .fn()
      .mockReturnValue({ mutate: vi.fn(), mutateAsync: vi.fn() }),
  };
});

vi.mock('./api', () => ({
  createCreateStory: vi.fn(() => ({ mutationFn: vi.fn() })),
  createEditStory: vi.fn(() => ({ mutationFn: vi.fn() })),
  createDeleteStory: vi.fn(() => ({ mutationFn: vi.fn() })),
  createSoftDeleteStory: vi.fn(() => ({ mutationFn: vi.fn() })),
  createGetStories: vi.fn(({ lang }) => ({
    queryKey: ['/web-edit/story', lang],
  })),
  createGetStory: vi.fn(({ id, lang }) => ({
    queryKey: ['/web-edit/story', id, lang],
  })),
}));

vi.mock('../../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('story mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useCreateStoryM should invalidate list and single query on success', () => {
    renderHook(() => useCreateStoryM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: 'new-st' }, { lang: Lang.EN });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/story', Lang.EN]);
    expect(keys).toContainEqual(['/web-edit/story', 'new-st', Lang.EN]);
  });

  it('useEditStoryM should invalidate list and single query on success', () => {
    renderHook(() => useEditStoryM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: '456' }, { lang: Lang.EN });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/story', Lang.EN]);
    expect(keys).toContainEqual(['/web-edit/story', '456', Lang.EN]);
  });

  it('useDeleteStoryM should invalidate list and single query using variables.id on success', () => {
    renderHook(() => useDeleteStoryM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.(undefined, { id: '456', lang: Lang.EN });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/story', Lang.EN]);
    expect(keys).toContainEqual(['/web-edit/story', '456', Lang.EN]);
  });

  it('useSoftDeleteStoryM should invalidate list and single query using variables.id on success', () => {
    renderHook(() => useSoftDeleteStoryM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.(undefined, { id: '456', lang: Lang.EN });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/story', Lang.EN]);
    expect(keys).toContainEqual(['/web-edit/story', '456', Lang.EN]);
  });
});
