import { describe, expect, it, vi } from 'vitest';
import { AxiosError } from 'axios';
import { baseURL, createErrorHandler, endpoints, instance } from './api';

// We need to mock axios BEFORE api.ts is imported if we want to capture the interceptors
// But since instance is already created, we can just spy on its interceptors or use them.

describe('api core', () => {
  it('should have correct configuration', () => {
    expect(baseURL).toBeDefined();
    expect(instance.defaults.timeout).toBe(5000);
    expect(instance.defaults.withCredentials).toBe(true);
  });

  it('should have correct endpoints', () => {
    expect(endpoints.vehicle).toBe('/vehicle');
    expect(endpoints.auth.logIn).toBe('/auth/login');
    expect(endpoints.webedit.all).toBe('/web-edit/get-all');
  });

  describe('createErrorHandler', () => {
    const endpoint = '/test-endpoint';
    const handler = createErrorHandler(endpoint);

    it('should format AxiosError correctly', async () => {
      const axiosError = new AxiosError(
        'Error message',
        'ERR_CODE',
        undefined,
        undefined,
        {
          status: 404,
          data: {
            code: 'ERR_CODE',
            message: 'Error message',
            status: 404,
            refreshSuccess: true,
          },
        } as any,
      );

      await expect(handler(axiosError as any)).rejects.toEqual({
        endpoint,
        status: 404,
        error: 'ERR_CODE',
        message: 'Error message',
        refreshSuccess: true,
      });
    });

    it('should format plain ErrorRes correctly', async () => {
      const errorRes = {
        code: 'PLAIN_ERR',
        message: 'Plain error message',
        status: 500,
      };

      await expect(handler(errorRes)).rejects.toEqual({
        endpoint,
        status: 500,
        error: 'PLAIN_ERR',
        message: 'Plain error message',
        refreshSuccess: undefined,
      });
    });

    it('should handle missing fields with defaults and log warning', async () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const minimalError = {} as any;

      await expect(handler(minimalError)).rejects.toEqual({
        endpoint,
        status: 400,
        error: 'UNKNOWN_ERROR',
        message: 'N/A',
        refreshSuccess: undefined,
      });

      expect(warnSpy).toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
