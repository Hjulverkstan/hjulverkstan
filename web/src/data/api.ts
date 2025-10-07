import axios, { AxiosError } from 'axios';

// Config
export const baseURL = import.meta.env.VITE_BACKEND_PROXY_SLUG;

export const endpoints = {
  vehicle: '/vehicle',
  site: '/site',
  image: '/image',
  ticket: '/ticket',
  employee: '/employee',
  location: '/location',
  customer: '/customer',
  auth: {
    logIn: '/auth/login',
    logOut: '/auth/logout',
    refreshToken: '/auth/refresh',
    verifyAuth: '/auth/verify',
  },
  webedit: {
    all: '/web-edit/get-all',
  },
  user: '/user',
};

export const instance = axios.create({
  baseURL,
  timeout: 5000,
  withCredentials: true,
});

/* Error responses that are not 400s should be errors in the request chain */
instance.interceptors.response.use(
  (res) => (res.data.error ? Promise.reject(res.data) : res),
  (err) => {
    console.warn(err);
    return Promise.reject(err);
  },
);

//

export interface ErrorRes {
  code: string;
  message: string;
  status: number;
  refreshSuccess?: true;
}

export interface StandardError {
  error: string;
  endpoint: string;
  message: string;
  status: number;
  refreshSuccess?: true;
}

/**
 * Should be used in .catch() on all requests. Used to unify the error format
 * and inject the endpoint value used to create custom error messages.
 */

export const createErrorHandler =
  (endpoint: string) => (inputErr: AxiosError<ErrorRes> | ErrorRes) => {
    const toValByProp = (prop: keyof ErrorRes) =>
      inputErr instanceof AxiosError
        ? inputErr.response?.data[prop]
        : inputErr[prop];

    const status = toValByProp('status');
    const message = toValByProp('message');
    const error = toValByProp('code');
    const refreshSuccess = toValByProp('refreshSuccess');

    const outputErr = {
      endpoint,
      status: status ?? 400,
      error: error ?? 'UNKNOWN_ERROR',
      message: message ?? 'N/A',
      refreshSuccess,
    };

    if (!status || !error || !message) {
      console.warn(
        'Incomplete error response in api layer, some values have been inferred',
        { inputErr, outputErr },
      );
    }

    return Promise.reject(outputErr);
  };
