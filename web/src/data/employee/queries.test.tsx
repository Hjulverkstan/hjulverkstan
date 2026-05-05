import { renderHook, waitFor } from '@testing-library/react';
import { useEmployeeQ, useEmployeesAsEnumsQ, useEmployeesQ } from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';

vi.mock('./api', () => ({
  createGetEmployees: vi.fn(() => ({
    queryKey: ['/employee'],
    queryFn: vi.fn(),
  })),
  createGetEmployee: vi.fn(({ id }) => ({
    queryKey: ['/employee', id],
    queryFn: vi.fn(),
  })),
}));

vi.mock('@components/EmployeeIcon', () => ({
  default: vi.fn(() => null),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('employee queries hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  it('useEmployeesQ should call the api factory', () => {
    renderHook(() => useEmployeesQ(), { wrapper });
    expect(api.createGetEmployees).toHaveBeenCalled();
  });

  it('useEmployeeQ should call the api factory when id is provided', () => {
    renderHook(() => useEmployeeQ({ id: '123' }), { wrapper });
    expect(api.createGetEmployee).toHaveBeenCalledWith({ id: '123' });
  });

  it('useEmployeeQ should not fetch when id is empty', () => {
    const { result } = renderHook(() => useEmployeeQ({ id: '' }), { wrapper });
    expect(result.current.isFetching).toBe(false);
  });

  describe('useEmployeesAsEnumsQ', () => {
    it('should map employees to EnumAttributes with correct label and value', async () => {
      (api.createGetEmployees as any).mockReturnValue({
        queryKey: ['/employee'],
        queryFn: () =>
          Promise.resolve([
            { id: 'e1', firstName: 'Anna', lastName: 'Berg' },
            { id: 'e2', firstName: 'Karl', lastName: 'Sven' },
          ]),
      });

      const { result } = renderHook(() => useEmployeesAsEnumsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[0].label).toBe('Anna Berg');
      expect(result.current.data?.[0].value).toBe('e1');
      expect(result.current.data?.[1].label).toBe('Karl Sven');
    });

    it('should apply a custom dataKey to each result', async () => {
      (api.createGetEmployees as any).mockReturnValue({
        queryKey: ['/employee'],
        queryFn: () =>
          Promise.resolve([{ id: 'e1', firstName: 'Anna', lastName: 'Berg' }]),
      });

      const { result } = renderHook(
        () => useEmployeesAsEnumsQ({ dataKey: 'assignedTo' }),
        { wrapper },
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.[0].dataKey).toBe('assignedTo');
    });
  });
});
