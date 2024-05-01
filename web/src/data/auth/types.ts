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
