export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  isAdmin: boolean;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthContextValue extends AuthState {
  login: () => void;
  logout: () => Promise<void>;
  refetch: () => Promise<void>;
}
