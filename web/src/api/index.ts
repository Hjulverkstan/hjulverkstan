import axios, { AxiosError } from 'axios';
import { refreshToken } from './';

export * from './auth';
export * from './vehicle';
export * from './ticket';
export * from './customer';

export const baseURL = 'http://localhost:8080/v1';

export const endpoints = {
  vehicle: '/vehicle',
  ticket: '/ticket',
  customer: '/customer',
  logIn: '/auth/login',
  logOut: '/auth/signout',
  refreshToken: '/auth/refreshtoken',
  verifyAuth: '/auth/verify',
};

/** This will be invoked as the catch handler on refresh token request */
let callbackUnsuccessfulRefresh: ((error: AxiosError) => void) | null = null;

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
        .catch(callbackUnsuccessfulRefresh)
        .then(() => Promise.reject(error));
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

/**
 * Should be used on all responses to convert ids to strings. Manually use
 * this function to map over your data before exposing it to the hooks layer
 * or if retrieveing singular object just pass it...
 */

export const parseResponseData = (obj: Record<string, any>) => {
  const stringId = (key: string) =>
    obj[key] ? { [key]: String(obj[key]) } : {};

  const stringIds = (key: string) =>
    obj[key] ? { [key]: obj[key].map((el: number) => String(el)) } : {};

  return {
    ...obj,
    ...stringId('id'),
    ...stringId('employeeId'),
    ...stringId('customerId'),
    ...stringIds('vehicleIds'),
    ...stringIds('ticketIds'),
    ...stringId('createdBy'),
    ...stringId('updatedBy'),
  };
};
