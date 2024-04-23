import { instance, endpoints } from './';

export interface LogInRes {
  token: string;
  refreshToken: string;
  type: string;
  username: string;
  email: string;
  id: number;
  roles: string[];
}

export interface LogInProps {
  username: string;
  password: string;
}

export const logIn = (body: LogInProps) =>
  instance.post<LogInRes>(endpoints.logIn, body).then((res) => {
    return res.data;
  });

export const logOut = (id: number) =>
  instance.post(`${endpoints.logOut}/${id}`).then((res) => {
    return res.data;
  });

export const verifyAuth = () =>
  instance.get<LogInRes>(endpoints.verifyAuth).then((res) => {
    return res.data;
  });

export const refreshToken = () =>
  instance.get(endpoints.refreshToken).then((res) => {
    return res.data;
  });

declare global {
  interface Window {
    logIn: ({ username, password }: LogInProps) => Promise<LogInRes>;
    logOut: (id: number) => Promise<any>;
  }
}

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  window.logIn = logIn;
  window.logOut = logOut;
}
