import axios, { AxiosError } from 'axios';

// Config

export const baseURL = 'http://localhost:8080/v1';

export const endpoints = {
  vehicle: '/vehicle',
  ticket: '/ticket',
  employee: '/employee',
  location: '/location',
  customer: '/customer',
  logIn: '/auth/login',
  logOut: '/auth/signout',
  refreshToken: '/auth/refreshtoken',
  verifyAuth: '/auth/verify',
};

export const instance = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
});

/* Error responses that are not 400s should be errors in the request chain */
instance.interceptors.response.use((res) => {
  if (res.data.error) return Promise.reject(res.data);
  return res;
});

//

/**
 * Should be used in .catch() on all request. Used to unify the error format
 * and inject the endpoint value used to create custom error messages.
 */

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
    ...stringId('locationId'),
    ...stringIds('vehicleIds'),
    ...stringIds('ticketIds'),
    ...stringId('createdBy'),
    ...stringId('updatedBy'),
  };
};
