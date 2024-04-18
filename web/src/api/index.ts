import axios, { AxiosError } from 'axios';
import { refreshToken } from './';

export * from './auth';
export * from './vehicle';
export * from './ticket';
export * from './customer';
export * from './location';

export const baseURL = 'http://localhost:8080/v1';

export const endpoints = {
  vehicle: '/vehicle',
  ticket: '/ticket',
  location: '/location',
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

// Interceptor: Turn non 400 error responses into error (react query needs
// errors to understand it is an error)

instance.interceptors.response.use((response) => {
  if (response.data.error) {
    return Promise.reject(response.data);
  }

  return response;
});

/** Interceptor only does one refresh token request on a 401
 * and adds a refresh timer to avoid multiple requests when
 * parallel requests have been made. */

let refreshSuccessTime = 0;

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
        .catch((err) => {
          if (
            Date.now() - refreshSuccessTime > 10000 &&
            callbackUnsuccessfulRefresh
          ) {
            callbackUnsuccessfulRefresh(err);
          }
        })
        .then(() => {
          refreshSuccessTime = Date.now();
          return Promise.reject(error);
        });
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
  (endpoint: string) => (error: AxiosError<Omit<ErrorRes, 'endpoint'>>) => {
    console.error(error);

    return Promise.reject({
      endpoint,
      ...(error.response?.data ?? {
        error: error.code,
        message: error.message,
        status: 400,
      }),
    });
  };

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
    ...stringId('locationId'),
    ...stringIds('vehicleIds'),
    ...stringIds('ticketIds'),
    ...stringId('createdBy'),
    ...stringId('updatedBy'),
  };
};
