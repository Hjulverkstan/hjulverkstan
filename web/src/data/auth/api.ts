import { AxiosError } from 'axios';

import { instance, endpoints } from '../api';

/*
 * Here we create an error interceptor and a subscribe function.
 *
 * The interceptor intercept 401s and tries to refresh the token. The logic
 * counts on failed request to do a retry, react-query has three retires. On
 * the next retry if refresh request was successful then the inital request
 * should be authorized. In case refresh request failes call the callback from
 * the subscribe function. Here the react application is responsible or rendering
 * a login page.
 */

let onFailedCallback: ((error: AxiosError) => void) | null = null;
let refreshSuccessTime = 0;

export const subscribeToRefreshFailed = (callback: () => void) => {
  onFailedCallback = callback;
  return () => (onFailedCallback = null);
};

export const errorInterceptor = (error: AxiosError) => {
  const isRefreshRequest = error.response?.request.responseURL.endsWith(
    endpoints.auth.refreshToken,
  );

  if (error.response?.status === 401 && !isRefreshRequest && onFailedCallback) {
    return refreshToken()
      .catch((err: AxiosError) => {
        if (Date.now() - refreshSuccessTime > 10000 && onFailedCallback) {
          onFailedCallback(err);
        }
      })
      .then(() => {
        refreshSuccessTime = Date.now();
        return Promise.reject(error);
      });
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
