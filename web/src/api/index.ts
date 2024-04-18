import axios, { AxiosError } from 'axios';
import { refreshToken } from './auth';

export * from './auth';
export * from './vehicle';

export const baseURL = 'http://localhost:8080/v1';

export const endpoints = {
  vehicle: '/vehicle',
  logIn: '/auth/login',
  logOut: '/auth/signout',
  refreshToken: '/auth/refreshtoken',
  verifyAuth: '/auth/verify',
};

let callbackUnsuccessfulRefresh: (() => void) | null = null;

/**
 * This function allows subscribing to a 401 event. Returns unsubscribe function.
 */
export const subscribeToUnsuccessfulTokenRefresh = (callback: () => void) => {
  callbackUnsuccessfulRefresh = callback;
  return () => (callbackUnsuccessfulRefresh = null);
};

export const instance = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isRefreshRequest = error.response?.request.responseURL.endsWith(
      endpoints.refreshToken,
    );
    if (
      error.response?.status === 401 &&
      !isRefreshRequest &&
      callbackUnsuccessfulRefresh
    ) {
      return refreshToken()
        .then(() => Promise.reject(error))
        .catch(callbackUnsuccessfulRefresh);
    }
    return Promise.reject(error);
  },
);

export interface ErrorRes {
  error: string;
  endpoint: string;
  message: string;
  status: number;
}

export const createErrorHandler =
  (endpoint: string) => (error: AxiosError<Omit<ErrorRes, 'endpoint'>>) =>
    Promise.reject({
      endpoint,
      ...(error.response?.data ?? {
        error: error.code,
        message: error.message,
        status: 400,
      }),
    });
