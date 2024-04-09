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

export const instance = axios.create({ baseURL, timeout: 5000 });

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
