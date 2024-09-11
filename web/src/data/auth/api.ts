import { AxiosError } from 'axios';

import { instance, endpoints } from '../api';

/*
 * Here we create an error interceptor to act as a middleware for all requests
 * in the application.
 *
 * The middleware intercepts 401s and attempts to refresh the token. There are
 * some key points with this interceptor:
 *
 * - Allow our [<Auth />](../../components/Auth.tsx) component to subscribe to
 *   failed refresh attempts, a failed refresh attempt means we are no longer
 *    authorized. Show the sign-in page...
 *
 * - Store and use the current refresh request promise so that redundant refresh
 *   requests are not triggered in parallel.
 *
 * - Successfull refresh requests adds a boolean to the error before rejecting,
 *   this enables:
 *   1. [<Auth />](../../components/Auth.tsx) to run its verify request again.
 *   2. React query will always retry, see our
 *      [retry options](../../root/index.tsx#commonOptions)
 */

let onFailedCallback: ((error: AxiosError) => void) | null = null;
let currentRefreshRequest: Promise<any> | null = null;

export const subscribeToRefreshFailed = (callback: () => void) => {
  onFailedCallback = callback;
  return () => (onFailedCallback = null);
};

export const errorInterceptor = (error: AxiosError) => {
  const isRefreshRequest = error.response?.request.responseURL?.endsWith(
    endpoints.auth.refreshToken,
  );

  if (error.response?.status === 401 && !isRefreshRequest && onFailedCallback) {
    if (!currentRefreshRequest) {
      currentRefreshRequest = refreshToken()
        .catch(onFailedCallback)
        .then(() => Promise.reject({ error, refreshSuccess: true }))
        .finally(() => {
          currentRefreshRequest = null;
        });
    }

    return currentRefreshRequest;
  }

  return Promise.reject(error);
};

instance.interceptors.response.use((x) => x, errorInterceptor);

//

export interface LogInRes {
  token: string;
  refreshToken: string;
  type: string;
  username: string;
  email: string;
  id: number;
  roles: string[];
}

export interface LogInParams {
  username: string;
  password: string;
}

export const logIn = (body: LogInParams) =>
  instance.post<LogInRes>(endpoints.auth.logIn, body).then((res) => {
    return res.data;
  });

export const logOut = (id: number) =>
  instance.post(`${endpoints.auth.logOut}/${id}`).then((res) => {
    return res.data;
  });

export const verifyAuth = () =>
  instance.get<LogInRes>(endpoints.auth.verifyAuth).then((res) => {
    return res.data;
  });

export const refreshToken = () =>
  instance.get(endpoints.auth.refreshToken).then((res) => {
    return res.data;
  });

//

declare global {
  interface Window {
    logIn: ({ username, password }: LogInParams) => Promise<LogInRes>;
    logOut: (id: number) => Promise<any>;
  }
}

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.logIn = logIn;
  window.logOut = logOut;
}
