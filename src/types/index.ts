export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
}

export interface LoginForm {
  identifier: string;
  password: string;
}
