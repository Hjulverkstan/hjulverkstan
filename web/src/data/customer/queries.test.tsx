import { renderHook, waitFor } from '@testing-library/react';
import {
  calculateAge,
  useCustomerQ,
  useCustomersAsEnumsQ,
  useCustomersQ,
} from './queries';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from './api';
import { CustomerType } from './types';
import { differenceInYears, parse } from 'date-fns';

vi.mock('./api', () => ({
  createGetCustomers: vi.fn(() => ({
    queryKey: ['/customer'],
    queryFn: vi.fn(),
  })),
  createGetCustomer: vi.fn(({ id }) => ({
    queryKey: ['/customer', id],
    queryFn: vi.fn(),
  })),
}));

vi.mock('@hooks/useTranslateRawEnums', () => ({
  useTranslateRawEnums: vi.fn((enums) => enums),
}));

vi.mock('@utils/enums', () => ({
  findEnum: vi.fn(() => ({ icon: undefined })),
}));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('customer queries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('calculateAge', () => {
    it('should calculate the correct age from a valid PIN', () => {
      const pin = '19811228-9874';
      const expected = differenceInYears(
        new Date(),
        parse(pin.substring(0, 8), 'yyyyMMdd', new Date()),
      );
      expect(calculateAge(pin)).toBe(expected);
    });

    it('should return undefined for null', () => {
      expect(calculateAge(null)).toBeUndefined();
    });

    it('should return undefined for undefined', () => {
      expect(calculateAge(undefined)).toBeUndefined();
    });
  });

  describe('useCustomersQ', () => {
    it('should augment customers with age from personalIdentityNumber', async () => {
      const pin = '19811228-9874';
      const expectedAge = differenceInYears(
        new Date(),
        parse(pin.substring(0, 8), 'yyyyMMdd', new Date()),
      );
      (api.createGetCustomers as any).mockReturnValue({
        queryKey: ['/customer'],
        queryFn: () =>
          Promise.resolve([
            { id: '1', firstName: 'John', personalIdentityNumber: pin },
          ]),
      });

      const { result } = renderHook(() => useCustomersQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect((result.current.data?.[0] as any).age).toBe(expectedAge);
    });
  });

  describe('useCustomerQ', () => {
    it('should call the api factory when id is provided', () => {
      renderHook(() => useCustomerQ({ id: '123' }), { wrapper });
      expect(api.createGetCustomer).toHaveBeenCalledWith({ id: '123' });
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useCustomerQ({ id: '' }), {
        wrapper,
      });
      expect(result.current.isFetching).toBe(false);
    });
  });

  describe('useCustomersAsEnumsQ', () => {
    it('should format PERSON label as "firstName lastName | phone"', async () => {
      (api.createGetCustomers as any).mockReturnValue({
        queryKey: ['/customer'],
        queryFn: () =>
          Promise.resolve([
            {
              id: '1',
              firstName: 'John',
              lastName: 'Doe',
              customerType: CustomerType.PERSON,
              phoneNumber: '+46701234567',
              anonymized: false,
            },
          ]),
      });

      const { result } = renderHook(() => useCustomersAsEnumsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.[0].label).toBe('John Doe | +46701234567');
    });

    it('should format ORG label as "orgName | phone"', async () => {
      (api.createGetCustomers as any).mockReturnValue({
        queryKey: ['/customer'],
        queryFn: () =>
          Promise.resolve([
            {
              id: '2',
              firstName: 'Contact',
              organizationName: 'Acme AB',
              customerType: CustomerType.ORG,
              phoneNumber: '+46812345678',
              anonymized: false,
            },
          ]),
      });

      const { result } = renderHook(() => useCustomersAsEnumsQ(), { wrapper });
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.[0].label).toBe('Acme AB | +46812345678');
    });

    it('should include contact person in ORG label when withOrgPerson is true', async () => {
      (api.createGetCustomers as any).mockReturnValue({
        queryKey: ['/customer'],
        queryFn: () =>
          Promise.resolve([
            {
              id: '2',
              firstName: 'Jane',
              lastName: 'Smith',
              organizationName: 'Acme AB',
              customerType: CustomerType.ORG,
              phoneNumber: '+46812345678',
              anonymized: false,
            },
          ]),
      });

      const { result } = renderHook(
        () => useCustomersAsEnumsQ({ withOrgPerson: true }),
        { wrapper },
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.[0].label).toContain('Acme AB');
      expect(result.current.data?.[0].label).toContain('Jane Smith');
    });

    it('should filter out anonymized customers when excludeAnonymized is true', async () => {
      (api.createGetCustomers as any).mockReturnValue({
        queryKey: ['/customer'],
        queryFn: () =>
          Promise.resolve([
            {
              id: '1',
              firstName: 'John',
              customerType: CustomerType.PERSON,
              phoneNumber: '+46701234567',
              anonymized: false,
            },
            {
              id: '2',
              firstName: 'Removed',
              customerType: CustomerType.PERSON,
              phoneNumber: '+46701234568',
              anonymized: true,
            },
          ]),
      });

      const { result } = renderHook(
        () => useCustomersAsEnumsQ({ excludeAnonymized: true }),
        { wrapper },
      );
      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(1);
      expect(result.current.data?.[0].value).toBe('1');
    });
  });
});
