import { renderHook } from '@testing-library/react';
import { useDeleteTextM, useEditTextM } from './mutations';
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
  createEditText: vi.fn(() => ({ mutationFn: vi.fn() })),
  createDeleteText: vi.fn(() => ({ mutationFn: vi.fn() })),
  createGetTexts: vi.fn(({ lang }) => ({ queryKey: ['/web-edit/text', lang] })),
  createGetText: vi.fn(({ id, lang }) => ({
    queryKey: ['/web-edit/text', id, lang],
  })),
}));

vi.mock('../../queries', () => ({
  invalidateQueries: vi.fn(),
}));

const queryClient = new QueryClient();
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('text mutations hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('useEditTextM should invalidate list and single query on success', () => {
    renderHook(() => useEditTextM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.({ id: '789' }, { lang: Lang.SV });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/text', Lang.SV]);
    expect(keys).toContainEqual(['/web-edit/text', '789', Lang.SV]);
  });

  it('useDeleteTextM should invalidate list and single query using variables.id on success', () => {
    renderHook(() => useDeleteTextM(), { wrapper });
    const onSuccess = (reactQuery.useMutation as any).mock.calls.at(-1)[0]
      ?.onSuccess;
    onSuccess?.(undefined, { id: '789', lang: Lang.SV });

    expect(invalidateQueries).toHaveBeenCalled();
    const keys = (invalidateQueries as any).mock.calls[0][0];
    expect(keys).toContainEqual(['/web-edit/text', Lang.SV]);
    expect(keys).toContainEqual(['/web-edit/text', '789', Lang.SV]);
  });
});
