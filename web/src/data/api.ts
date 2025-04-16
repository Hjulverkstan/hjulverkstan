import axios, { AxiosError } from 'axios';

// Config
export const baseURL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/v1';

export const endpoints = {
  vehicle: '/vehicle',
  image: '/image',
  ticket: '/ticket',
  employee: '/employee',
  location: '/location',
  customer: '/customer',
  auth: {
    logIn: '/auth/login',
    logOut: '/auth/signout',
    refreshToken: '/auth/refreshtoken',
    verifyAuth: '/auth/verify',
  },
  webedit: {
    all: '/webedit/get-all',
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

/**
 * Should be used on all responses to convert ids to strings. Manually use
 * this function to map over your data before exposing it to the hooks layer,
 * or if retrieving a singular object pass it...
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
