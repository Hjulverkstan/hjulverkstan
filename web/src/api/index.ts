import axios, { AxiosError } from 'axios';

export * from './auth';
export * from './vehicle';

export const baseURL = 'http://localhost:8080/v1';

export const endpoints = {
  vehicle: '/vehicle',
  logIn: '/auth/login',
  logOut: '/auth/signout',
  refreshToken: '/auth/refreshtoken',
};

let callback401: (() => void) | null = null;

/**
 * This function allows subscribing to a 401 event. Returns unsubscribe function.
 */
export const subscribeTo401 = (callback: () => void) => {
  callback401 = callback;
  return () => (callback401 = null);
};

export const instance = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && callback401) {
      callback401();
    }
    return Promise.reject(error);
  },
);

// type QueryParamsCreator<Res, Params = undefined> = (params: Params) => {
//   queryKey: string[];
//   queryFn: () => Promise<Res>;
// };

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
