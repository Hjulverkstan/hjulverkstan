import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AxiosError } from 'axios';
import {
  errorInterceptor,
  logIn,
  logOut,
  refreshToken,
  subscribeToRefreshFailed,
  verifyAuth,
} from './api';
import { endpoints, instance } from '../api';

vi.mock('../api', () => {
  const mockInstance = {
    interceptors: {
      response: {
        use: vi.fn(),
      },
    },
    post: vi.fn(),
    get: vi.fn(),
  };
  return {
    instance: mockInstance,
    endpoints: {
      auth: {
        logIn: '/auth/login',
        logOut: '/auth/logout',
        refreshToken: '/auth/refresh',
        verifyAuth: '/auth/verify',
      },
    },
  };
});

describe('auth api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('subscribeToRefreshFailed', () => {
    it('should allow subscribing to refresh failure', async () => {
      const callback = vi.fn();
      const unsubscribe = subscribeToRefreshFailed(callback);

      // Triggering the internal callback requires triggering errorInterceptor with a failed refresh
      const refreshError = {
        response: {
          status: 401,
          request: { responseURL: '/some-other-endpoint' },
        },
      } as unknown as AxiosError;

      // Mock refreshToken to fail
      (instance.get as any).mockRejectedValue(new Error('Refresh Failed'));

      try {
        await errorInterceptor(refreshError);
      } catch {
        // Expected to fail
      }

      expect(callback).toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe('errorInterceptor', () => {
    it('should reject immediately if status is not 401', async () => {
      const error = {
        response: {
          status: 500,
          request: { responseURL: '/some-url' },
        },
      } as unknown as AxiosError;
      await expect(errorInterceptor(error)).rejects.toEqual(error);
    });

    it('should reject immediately if it is a failed refresh request', async () => {
      const error = {
        response: {
          status: 401,
          request: { responseURL: '.../auth/refresh' },
        },
      } as unknown as AxiosError;

      await expect(errorInterceptor(error)).rejects.toEqual(error);
    });

    it('should handle successful token refresh', async () => {
      const callback = vi.fn();
      subscribeToRefreshFailed(callback);

      const error = {
        response: {
          status: 401,
          request: { responseURL: '/data-endpoint' },
        },
      } as unknown as AxiosError;

      (instance.get as any).mockResolvedValue({ data: { token: 'new-token' } });

      await expect(errorInterceptor(error)).rejects.toEqual(
        expect.objectContaining({ refreshSuccess: true }),
      );

      expect(instance.get).toHaveBeenCalledWith(endpoints.auth.refreshToken);
      expect(callback).not.toHaveBeenCalled();
    });

    it('should reuse the same refresh request for concurrent 401s', async () => {
      const error = {
        response: {
          status: 401,
          request: { responseURL: '/endpoint' },
        },
      } as unknown as AxiosError;

      let resolveRefresh: any;
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });
      (instance.get as any).mockReturnValue(refreshPromise);

      const interceptorCall1 = errorInterceptor(error);
      const interceptorCall2 = errorInterceptor(error);
      expect(instance.get).toHaveBeenCalledTimes(1);

      resolveRefresh({ data: {} });
      await Promise.allSettled([interceptorCall1, interceptorCall2]);
    });
  });

  describe('API wrappers', () => {
    it('logIn should call correct endpoint', async () => {
      (instance.post as any).mockResolvedValue({ data: { user: 'test' } });

      const result = await logIn({ username: 'u', password: 'p' });

      expect(instance.post).toHaveBeenCalledWith(
        endpoints.auth.logIn,
        expect.any(Object),
        expect.any(Object),
      );
      expect(result).toEqual({ user: 'test' });
    });

    it('logIn should support custom baseURL', async () => {
      (instance.post as any).mockResolvedValue({ data: {} });

      await logIn({ username: 'u', password: 'p' }, 'https://custom.api');

      expect(instance.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.objectContaining({ baseURL: 'https://custom.api' }),
      );
    });

    it('logOut should call correct endpoint', async () => {
      (instance.post as any).mockResolvedValue({ data: 'ok' });

      const result = await logOut();

      expect(instance.post).toHaveBeenCalledWith(endpoints.auth.logOut);
      expect(result).toBe('ok');
    });

    it('verifyAuth should call correct endpoint', async () => {
      (instance.get as any).mockResolvedValue({ data: 'user' });

      const result = await verifyAuth();

      expect(instance.get).toHaveBeenCalledWith(endpoints.auth.verifyAuth);
      expect(result).toBe('user');
    });

    it('refreshToken should call correct endpoint', async () => {
      (instance.get as any).mockResolvedValue({ data: 'new-token' });

      const result = await refreshToken();

      expect(instance.get).toHaveBeenCalledWith(endpoints.auth.refreshToken);
      expect(result).toBe('new-token');
    });
  });
});
