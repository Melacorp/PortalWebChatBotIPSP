export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  identifier: string; // username or email
  password: string;
  rememberMe: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}
