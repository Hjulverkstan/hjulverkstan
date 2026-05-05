import { renderHook } from '@testing-library/react';
import { useUserQ, useUsersQ } from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';

vi.mock('./api', () => ({
  createGetUsers: vi.fn(() => ({ queryKey: ['/user'], queryFn: vi.fn() })),
  createGetUser: vi.fn(({ id }) => ({
    queryKey: ['/user', id],
    queryFn: vi.fn(),
  })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('user queries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('useUsersQ should call the api factory', () => {
    renderHook(() => useUsersQ(), { wrapper });
    expect(api.createGetUsers).toHaveBeenCalled();
  });

  it('useUserQ should call the api factory when id is provided', () => {
    renderHook(() => useUserQ({ id: '123' }), { wrapper });
    expect(api.createGetUser).toHaveBeenCalledWith({ id: '123' });
  });

  it('useUserQ should not fetch when id is empty', () => {
    const { result } = renderHook(() => useUserQ({ id: '' }), { wrapper });
    expect(result.current.isFetching).toBe(false);
  });
});
